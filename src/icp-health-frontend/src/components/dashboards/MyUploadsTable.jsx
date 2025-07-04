import React, { useEffect, useState,forwardRef,useImperativeHandle } from 'react';
import './myUploads.css';
import { createActor } from '../../../../declarations/icp-health-backend'; // ✅ your correct path
import { AuthClient } from "@dfinity/auth-client";
import { Trash2 } from 'lucide-react';
import { getActor } from '../../utils/actorUtils';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND; // ✅ your correct env var



const MyUploadsTable = forwardRef(({ onUploadCountChange, onEarningsChange }, ref) => {
  const [uploads, setUploads] = useState([]);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const actor = await getActor();
      const data = await actor.get_my_uploads();
      setUploads(data);
      setErrorOccurred(false);
   if (onUploadCountChange) {
  onUploadCountChange(data.length); // Total document count
}

if (onEarningsChange) {
  const total = data.reduce((sum, item) => sum + Number(item.earning_icp || 0), 0);
  onEarningsChange(total);
}
 // <-- Send count to parent
    } catch (err) {
      console.error("Error fetching uploads:", err);
      setErrorOccurred(true);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
  refreshUploads: fetchUploads
}));


  useEffect(() => {
    fetchUploads();
  }, []);

  const downloadBase64File = (base64, filename) => {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${base64}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (hash) => {
    try {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const actor = await getActor();
    const response = await actor.delete_upload(hash);

      if ('ok' in response && response.ok === null) {
        setUploads(prev => prev.filter(item => item.hash !== hash));
        setPreviewIndex(null);
        alert("File deleted successfully!");
      } else if ('err' in response) {
        alert("Delete failed: " + response.err);
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      setUploads(prev => prev.filter(item => item.hash !== hash));
        setPreviewIndex(null);
        alert("File deleted successfully!");
    }
  };

  const getMimeType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      default: return 'application/octet-stream';
    }
  };

  return (
    <div className="outer-wrapper">
    <div className="uploads-table-wrapper">
      <h3>My Uploaded Documents</h3>

      {loading ? (
        <p className="loading-text">Loading uploads...</p>
      ) : errorOccurred ? (
        <p className="error-text">⚠ Could not fetch uploads. Please try again later.</p>
      ) : (
        <table className="uploads-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Document Name</th>
              <th>Category</th>
              <th>Keywords</th>
              <th>Doctor</th>
              <th>Earning (ICP)</th>
              <th>Uploaded At</th>
              <th>View</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {uploads.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data-text" style={{ textAlign: 'center' }}>
                  No uploads found.
                </td>
              </tr>
            ) : (
              uploads.map((item, index) => (
                <React.Fragment key={item.hash}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.file_name}</td>
                    <td>{item.doc_type}</td>
                    <td>{item.subtype}</td>
                    <td>{item.doctor_name || "N/A"}</td>
                    <td>{Number(item.earning_icp) || 0}</td>
                    <td>{new Date(Number(item.timestamp) * 1000).toLocaleString()}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setPreviewIndex(prev => (prev === index ? null : index))}
                      >
                        {previewIndex === index ? "Hide" : "View"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="download-btn"
                        onClick={() => downloadBase64File(item.file_content, item.file_name)}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.hash)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>

                  {previewIndex === index && (
                    <tr className="preview-row">
                      <td colSpan="10">
                        {getMimeType(item.file_name).startsWith("image/") ? (
                          <img
                            src={`data:${getMimeType(item.file_name)};base64,${item.file_content}`}
                            alt={item.file_name}
                            style={{ maxWidth: '100%', maxHeight: '400px' }}
                          />
                        ) : getMimeType(item.file_name) === "application/pdf" ? (
                          <iframe
                            src={`data:application/pdf;base64,${item.file_content}`}
                            title="PDF Preview"
                            width="100%"
                            height="500px"
                          ></iframe>
                        ) : (
                          <p style={{ color: 'gray' }}>
                            Preview not supported for this file type.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
});

export default MyUploadsTable;