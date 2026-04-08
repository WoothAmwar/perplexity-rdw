import NavSidebar from '../components/NavSidebar';
import CoverPage from '../sections/CoverPage';
import ThesisPage from '../sections/ThesisPage';
import SummaryPage from '../sections/SummaryPage';
import PipelinePage from '../sections/PipelinePage';
import QuantumPage from '../sections/QuantumPage';
import PharmaPage from '../sections/PharmaPage';
import FuelCellPage from '../sections/FuelCellPage';
import SpacePage from '../sections/SpacePage';
import RevenuePage from '../sections/RevenuePage';
import EbitdaPage from '../sections/EbitdaPage';
import DeleverPage from '../sections/DeleverPage';
import WaccPage from '../sections/WaccPage';
import PeersPage from '../sections/PeersPage';
import SotpPage from '../sections/SotpPage';
import Valuation3DPage from '../sections/Valuation3DPage';
import CatalystsPage from '../sections/CatalystsPage';

export default function MainPitch() {
  return (
    <div className="relative" style={{ background: 'var(--space-bg)' }}>
      <NavSidebar />
      <CoverPage />
      <ThesisPage />
      <SummaryPage />
      <PipelinePage />
      <QuantumPage />
      <PharmaPage />
      <FuelCellPage />
      <SpacePage />
      <RevenuePage />
      <EbitdaPage />
      <DeleverPage />
      <WaccPage />
      <PeersPage />
      <SotpPage />
      <Valuation3DPage />
      <CatalystsPage />
    </div>
  );
}
