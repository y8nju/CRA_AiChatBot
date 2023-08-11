import 'styles/layout.scss';
import { Outlet } from "react-router-dom";
import Nav from "layout/nav";
import { useContext } from 'react';
import { LayoutContext } from 'context/layoutContext';
import Snackbar from '../components/commons/Snackbar';

const Layout = () => {
  const { isSnacbar } = useContext(LayoutContext);

  return <main>
    <Nav/>
    <Outlet/>
    {isSnacbar.open && <Snackbar/>}
  </main>;
};

export default Layout;