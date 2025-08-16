import { LayoutGrid, FileText, Users, MessageSquare } from "lucide-react";
import StatsBox from "../../componnents/StatsBox";

const AdminHome = () => {
  // You can fetch real data here or use dummy numbers
  const stats = [
    {
      name: "Users",
      number: 102,
      link: "/dashboard/users",
      icon: <Users className="w-8 h-8" />,
    },
    {
      name: "Posts",
      number: 187,
      link: "/dashboard/posts",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      name: "Categories",
      number: 12,
      link: "/dashboard/categories",
      icon: <LayoutGrid className="w-8 h-8" />,
    },
    {
      name: "Comments",
      number: 356,
      link: "/dashboard/comments",
      icon: <MessageSquare className="w-8 h-8" />,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
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
    </div>
  );
};

export default AdminHome;
