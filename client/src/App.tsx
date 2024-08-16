import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
function App() {
  return (
    <div className="flex flex-row-reverse w-full h-screen">
      {/* Sidbar */}
      <Sidebar />
      {/* Rest of the page */}
      <div className="flex-1 bg-light flex justify-end p-8 h-fit min-h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
