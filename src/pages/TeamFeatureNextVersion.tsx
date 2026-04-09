import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import Teams from "@/pages/Teams";
import ProjectDetail from "@/pages/ProjectDetail";
import MyOrganization from "@/pages/MyOrganization";

const BASE_PATH = "/team-feature-next-version";

const TeamFeatureNextVersion = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname.startsWith(`${BASE_PATH}/project/`)) return <ProjectDetail basePath={BASE_PATH} />;
    if (location.pathname === `${BASE_PATH}/teams`) return <Teams basePath={BASE_PATH} showProjectSubTabs />;
    if (location.pathname === `${BASE_PATH}/my-organization`) return <MyOrganization basePath={BASE_PATH} />;
    return <ChatArea />;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar showInvite={false} basePath={BASE_PATH} customProjects={[
        { name: "Personal Project", id: "99", chats: ["Q4 Strategy alignment", "Claude settings help", "Design system updates"] },
        { name: "Project Ruby Labs", id: "1", chats: ["Q4 Strategy alignment", "Claude settings help", "Design system updates"] },
        { name: "Project Empty", id: "2", chats: [] },
      ]} />
      {renderContent()}
    </div>
  );
};

export default TeamFeatureNextVersion;
