import NavSidebar from '../components/NavSidebar';
import CoverPage from '../sections/CoverPage';
import ThesisPage from '../sections/ThesisPage';
import SummaryPage from '../sections/SummaryPage';
import PipelinePage from '../sections/PipelinePage';
import QuantumPage from '../sections/QuantumPage';
import PharmaPage from '../sections/PharmaPage';
import FuelCellPage from '../sections/FuelCellPage';
import SpacePage from '../sections/SpacePage';
import BacklogMapPage from '../sections/BacklogMapPage';
import RevenuePage from '../sections/RevenuePage';
import EbitdaPage from '../sections/EbitdaPage';
import DeleverPage from '../sections/DeleverPage';
import WaccPage from '../sections/WaccPage';
import PeersPage from '../sections/PeersPage';
import SotpPage from '../sections/SotpPage';
import Valuation3DPage from '../sections/Valuation3DPage';
import CatalystsPage from '../sections/CatalystsPage';
import SourcesPage from '../sections/SourcesPage';

export default function MainPitch() {
  return (
    <div className="relative">
      <NavSidebar />
      <CoverPage />
      <ThesisPage />
      <SummaryPage />
      <PipelinePage />
      <QuantumPage />
      <PharmaPage />
      <FuelCellPage />
      <SpacePage />
      <BacklogMapPage />
      <RevenuePage />
      <EbitdaPage />
      <DeleverPage />
      <WaccPage />
      <PeersPage />
      <SotpPage />
      <Valuation3DPage />
      <CatalystsPage />
      <SourcesPage />
    </div>
  );
}
