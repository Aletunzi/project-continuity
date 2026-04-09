import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import Teams from "@/pages/Teams";
import ProjectDetail from "@/pages/ProjectDetail";
import MyOrganization from "@/pages/MyOrganization";

const BASE_PATH = "/member-view";

const MemberView = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname.startsWith(`${BASE_PATH}/project/`)) return <ProjectDetail basePath={BASE_PATH} />;
    if (location.pathname === `${BASE_PATH}/teams`) return <Teams basePath={BASE_PATH} hideAddProject />;
    if (location.pathname === `${BASE_PATH}/my-organization`) return <MyOrganization basePath={BASE_PATH} />;
    return <ChatArea />;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar showInvite={false} basePath={BASE_PATH} />
      {renderContent()}
    </div>
  );
};

export default MemberView;
