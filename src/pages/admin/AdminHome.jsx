import { LayoutGrid, FileText, Users, MessageSquare } from "lucide-react";
import StatsBox from "../../componnents/StatsBox";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminHome = () => {
  // Dummy stats data
  const stats = [
    { name: "Users", number: 102, link: "/dashboard/users", icon: <Users className="w-8 h-8" /> },
    { name: "Posts", number: 187, link: "/dashboard/posts", icon: <FileText className="w-8 h-8" /> },
    { name: "Categories", number: 12, link: "/dashboard/categories", icon: <LayoutGrid className="w-8 h-8" /> },
    { name: "Comments", number: 356, link: "/dashboard/comments", icon: <MessageSquare className="w-8 h-8" /> },
  ];

  // Dummy chart data
  const lineData = [
    { name: "Jan", users: 40 },
    { name: "Feb", users: 60 },
    { name: "Mar", users: 80 },
    { name: "Apr", users: 100 },
    { name: "May", users: 70 },
  ];

  const barData = [
    { name: "Posts", count: 187 },
    { name: "Comments", count: 356 },
    { name: "Users", count: 102 },
    { name: "Categories", count: 12 },
  ];

  const pieData = [
    { name: "Users", value: 102 },
    { name: "Posts", value: 187 },
    { name: "Comments", value: 356 },
    { name: "Categories", value: 12 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const radarData = [
    { subject: "Users", A: 102 },
    { subject: "Posts", A: 187 },
    { subject: "Categories", A: 12 },
    { subject: "Comments", A: 356 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stats Boxes */}
      <div className="flex flex-wrap -m-2">
        {stats.map((stat, index) => (
          <StatsBox
            key={stat.name}
            index={index}
            name={stat.name}
            number={stat.number}
            link={stat.link}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-10 space-y-10">
        {/* Line Chart */}
        <div className="w-full h-80 bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">User Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-80 bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Content Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" barSize={50} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="w-full h-80 bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="w-full h-80 bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Radar Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={120} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Metrics" dataKey="A" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} isAnimationActive={true} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
