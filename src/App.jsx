import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Layout from 'layout/layout';
import LoginPage from 'containers/users/login';
import RegisterPage from 'containers/users/register';
import VoiceChatlist from 'containers/voice/voiceChatlist';
import ChatMain from 'containers/voice/chatMain';
import VoiceChatroom from 'containers/voice/voiceChatroom';
import { AccountContextProvider } from 'context/userContext';
import { LayoutContextProvider } from 'context/layoutContext';

function App() {

  return (
    <Router>
      <AccountContextProvider>
        <LayoutContextProvider>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='/' element={<ChatMain />} />
              <Route path='/room/:roomId' element={<VoiceChatroom />} />
              <Route path='/list' element={<VoiceChatlist />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
            </Route>
          </Routes>
        </LayoutContextProvider>
      </AccountContextProvider>
    </Router>
  )
}

export default App;
