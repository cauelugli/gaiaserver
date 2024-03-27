/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import WelcomingMessage from "../components/small/WelcomingMessage";

const Home = ({ user, configDashboard }) => {
  const [showMessage, setShowMessage] = React.useState(true);

  React.useEffect(() => {
    if (configDashboard) {
      setShowMessage((prevState) => ({
        ...prevState,
        isActive: configDashboard.showHello,
      }));
    }
  }, [configDashboard]);

  return (
    <>
      <WelcomingMessage user={user} showMessage={showMessage} />
    </>
  );
};

export default Home;
