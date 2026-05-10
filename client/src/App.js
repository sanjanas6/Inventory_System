import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Requests from "./pages/Requests";
import Orders from "./pages/Orders";
import EntryCoupon from "./pages/EntryCoupon";
import MainLayout from "./layouts/MainLayout";
import EntryList from "./pages/EntryList";
import Supervisor from "./pages/Supervisor";
import Checksheet from "./pages/Checksheet";
import Indent from "./pages/Indent";
import PartsList from "./pages/PartsList";
import PartsDetails from "./pages/PartsDetails";
import PartsView from "./pages/PartsView";
import Estimate from "./pages/Estimate";
import AdminView from "./pages/AdminView";
import EstimateView from "./pages/EstimateView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
        <Route path="/requests" element={<MainLayout><Requests /></MainLayout>} />
        <Route path="/orders" element={<MainLayout><Orders /></MainLayout>} />
        <Route path="/entry" element={<MainLayout><EntryCoupon /></MainLayout>} />
        <Route path="/entries" element={<MainLayout><EntryList /></MainLayout>} />
        <Route path="/supervisor/:id" element={<MainLayout><Supervisor /></MainLayout>} />
        <Route path="/checksheet/:id" element={<MainLayout><Checksheet /></MainLayout>} />
        <Route path="/indent/:id" element={<MainLayout><Indent /></MainLayout>} />
        <Route path="/parts" element={<MainLayout><PartsList /></MainLayout>} />
        <Route path="/parts/:id" element={<MainLayout><PartsDetails /></MainLayout>} />
        <Route path="/parts-view/:id" element={<MainLayout><PartsView /></MainLayout>} />
        <Route path="/estimate/:id" element={<MainLayout><Estimate /></MainLayout>} />
        <Route path="/estimate-view/:id" element={<MainLayout><EstimateView /></MainLayout>} />
        <Route path="/admin-view/:id" element={<MainLayout><AdminView /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;