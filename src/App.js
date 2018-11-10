import React, {
  Component,
} from 'react';
import DevTools from 'mobx-react-devtools';
import {
  Switch,
  Route,
} from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import './theme/app.scss';
import DefaultCard from './components/DefaultCard';
class App extends Component {
  render() {
    return (<div className="App" >
      <Switch >
        <Route exact
          path="/"
          component={
            Home
          }
        />
        <Route exact
          path="/xw"
          component={
            () => <DefaultCard type={2} />
          }
        />
        <Route component={
          NotFound
        }
        />
      </Switch > {
        // process.env.NODE_ENV === 'development' && <DevTools />
      }
    </div>
    );
  }
}
export default App;
