import {
  Switch,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';

import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Play from './pages/Play';

const nav = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/play',
    component: Play,
  },
];

function App() {
  return (
    <Router>
      <Switch>
        {nav.map((item, i) => <Route path={item.path} exact={item.exact} key={i} component={item.component} />)}
      </Switch>
    </Router> 
  );
}

export default App;
