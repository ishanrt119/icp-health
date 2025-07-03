import React from 'react';
import StatCard from "../shared/StatCard";
import './landing.css';
import {
  Users,
  Database,
  Heart,
  Award
} from 'lucide-react';

const PostLoginLanding = () => {
  return (
    <div className="landing-container">
      <h2 className="landing-title">Welcome to Your Health Dashboard</h2>
      <div className="stats-grid">
        <StatCard title="Users" value="1.2k" icon={Users} color="blue" />
        <StatCard title="Records" value="15k" icon={Database} color="green" />
        <StatCard title="Active Sessions" value="320" icon={Heart} color="purple" />
        <StatCard title="Rewards" value="25" icon={Award} color="yellow" />
      </div>
    </div>
  );
};

export default PostLoginLanding;