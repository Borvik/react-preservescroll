import React from 'react';
import './App.css';
import {
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { Page2 } from './page2';
import { Page1 } from './page1';

function App() {
  const h = useHistory();
  const loc = useLocation<{preserveScrollDisabled?: boolean}>();
  return (
    <div className="App">
      <nav>
        <ul>
          <Route exact path="/">
            <li>
              {!!loc?.state?.preserveScrollDisabled
                ? <a onClick={() => {h.replace(loc, {preserveScrollDisabled: false}); return false;}}>Enable</a>
                : <a onClick={() => {h.replace(loc, {preserveScrollDisabled: true}); return false;}}>Disable</a>
              }
            </li>
          </Route>
          <li>
            <Link to="/">Page 1</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
          <li>
            <a href='https://www.google.com'>Google</a>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/page-2" >
          <Page2 />
        </Route>
        <Route path="/">
          <Page1 preserveScrollDisabled={!!loc?.state?.preserveScrollDisabled} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
