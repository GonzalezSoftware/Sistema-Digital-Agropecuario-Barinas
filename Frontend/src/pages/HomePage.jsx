import React from "react";
import PortalNavBar from "../components/PortalNavBar";
import PortalHero from "../components/PortalHero";
import PortalInformativo from "../components/PortalInformativo";
import PortalSolucionesIntegrales from "../components/PortalSolucionesIntegrales";
import PortalSobreNosotros from "../components/PortalSobreNosotros";
import PortalContactos from "../components/PortalContactos";
import Footer from "../components/Footer";
import escudo from "../assets/logo2.jpg";
import logo from "../assets/gobierno.jpg";

import {
  NAV_ITEMS,
} from "../components/ui/PrediosProduccionUI";


export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>
      <PortalNavBar />
      <PortalHero />
      <PortalInformativo />
      <PortalSolucionesIntegrales />
      <PortalSobreNosotros />
      <PortalContactos />
      <Footer logo={logo} escudo={escudo} NAV_ITEMS={NAV_ITEMS} />
    </div>
  );
}