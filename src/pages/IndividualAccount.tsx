import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import Teams from "@/pages/Teams";
import ProjectDetail from "@/pages/ProjectDetail";

const IndividualAccount = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname.startsWith("/project/")) return <ProjectDetail />;
    return <ChatArea />;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar showTeams={false} showInvite={false} showOrg={false} />
      {renderContent()}
    </div>
  );
};

export default IndividualAccount;
