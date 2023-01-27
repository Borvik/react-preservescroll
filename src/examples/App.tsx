import React, { useCallback } from 'react';
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
  console.log('Current State:', loc.state);

  const setPreserveDisabled = useCallback((disabled: boolean) => {
    if (!loc.state) {
      h.replace(loc, { preserveScrollDisabled: disabled });
    } else {
      h.replace({
        ...loc,
        state: {
          ...loc.state,
          preserveScrollDisabled: disabled,
        }
      });
    }
  }, [h, loc]);
  return (
    <div className="App">
      <nav>
        <ul>
          <Route exact path="/">
            <li>
              {!!loc?.state?.preserveScrollDisabled
                ? <a onClick={() => {console.log('enabling scroll preservation'); setPreserveDisabled(false); return false;}}>Enable</a>
                : <a onClick={() => {console.log('disabling scroll preservation'); setPreserveDisabled(true); return false;}}>Disable</a>
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
