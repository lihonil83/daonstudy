import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Math from './pages/Math/Math';
import English from './pages/English/English';
import Review from './pages/Review/Review';
import Progress from './pages/Progress/Progress';
import NotFound from './pages/NotFound/NotFound';
import { smokeRoutesEnabled } from './config/featureFlags';
import SmokeQuizComplete from './pages/Smoke/SmokeQuizComplete';
import SmokeReviewComplete from './pages/Smoke/SmokeReviewComplete';
import SmokeWrongToReviewFlow from './pages/Smoke/SmokeWrongToReviewFlow';
import SmokeStorageFlow from './pages/Smoke/SmokeStorageFlow';
import styles from './App.module.css';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/math" element={<Math />} />
        <Route path="/math/:unitId" element={<Math />} />
        <Route path="/english" element={<English />} />
        <Route path="/english/:unitId" element={<English />} />
        <Route path="/review" element={<Review />} />
        <Route path="/progress" element={<Progress />} />
        {smokeRoutesEnabled ? <Route path="/smoke/quiz-complete" element={<SmokeQuizComplete />} /> : null}
        {smokeRoutesEnabled ? <Route path="/smoke/review-complete" element={<SmokeReviewComplete />} /> : null}
        {smokeRoutesEnabled ? <Route path="/smoke/wrong-to-review" element={<SmokeWrongToReviewFlow />} /> : null}
        {smokeRoutesEnabled ? (
          <Route
            path="/smoke/wrong-to-review-complete"
            element={<SmokeWrongToReviewFlow autoStartReview />}
          />
        ) : null}
        {smokeRoutesEnabled ? <Route path="/smoke/storage-flow" element={<SmokeStorageFlow />} /> : null}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export function AppShell({ RouterComponent = HashRouter, routerProps = {} }) {
  return (
    <div className={styles.appRoot}>
      <RouterComponent {...routerProps}>
        <AppRoutes />
      </RouterComponent>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
