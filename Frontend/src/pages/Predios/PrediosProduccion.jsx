import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";
import PrediosProduccionNavbar from "../../components/PrediosProduccionNavbar";
import PrediosProduccionHero from "../../components/PrediosProduccionHero";
import PrediosProduccionInformacion from "../../components/PrediosProduccionInformacion";
import Footer from "../../components/Footer";
import {
  IconPhone, IconMail, IconClock, IconMap, IconClipboard, IconHistory, IconBarChart,
  IconUsers, IconLayers, IconMapPin, IconTrendingUp, IconCheckCircle, IconContact,
  IconVisit, IconRegister, IconFile, IconInfo,
  // 1. Asegúrate de que estos también estén incluidos en tus imports:
  IconDashboard, IconSelect, IconSliders, IconRefresh, IconFileText,
  NAV_ITEMS, GlobalStyles
} from "../../components/ui/PrediosProduccionUI";


export default function PrediosPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>

      <GlobalStyles />

      {/* Navbar */}
      <PrediosProduccionNavbar logo={logo} escudo={escudo} />

      {/* Hero */}
      <PrediosProduccionHero />

      {/* Información */}
      <PrediosProduccionInformacion
        IconClipboard={IconClipboard}
        IconMap={IconMap}
        IconHistory={IconHistory}
        IconBarChart={IconBarChart}
        IconCheckCircle={IconCheckCircle}
        IconPhone={IconPhone}
        IconMail={IconMail}
        IconClock={IconClock}
        IconDashboard={IconDashboard}
        IconSelect={IconSelect}
        IconSliders={IconSliders}
        IconTrendingUp={IconTrendingUp}
        IconRefresh={IconRefresh}
        IconFileText={IconFileText}
      />

      {/* Footer */}
      <Footer logo={logo} escudo={escudo} NAV_ITEMS={NAV_ITEMS} />

    </div>
  );
}