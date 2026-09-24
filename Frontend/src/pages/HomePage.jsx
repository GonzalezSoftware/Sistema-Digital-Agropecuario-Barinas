import React from "react";
import PortalNavBar from "../components/PortalNavBar";
import PortalHero from "../components/PortalHero";
import PortalInformativo from "../components/PortalInformativo";
import PortalSolucionesIntegrales from "../components/PortalSolucionesIntegrales";
import PortalSobreNosotros from "../components/PortalSobreNosotros";
import PortalContactos from "../components/PortalContactos";
import PortalFooter from "../components/PortalFooter";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>
      <PortalNavBar />
      <PortalHero />
      <PortalInformativo />
      <PortalSolucionesIntegrales />
      <PortalSobreNosotros />
      <PortalContactos />
      <PortalFooter />
    </div>
  );
}