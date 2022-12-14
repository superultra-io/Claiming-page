import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Buffer } from "buffer";
import ConnectAccount from "./components/Account/ConnectAccount";
import DisplayPane from "./components/displayPane/DisplayPane";
import AdminPane from "./components/admin/AdminPane";
import ChainVerification from "./components/chains/ChainVerification";
import { getAdminAddress } from "./utils/contractCall";
import background from "./assets/images/background.png";
import LepriconLogo_Black from "./assets/images/LepriconLogo_Black.png";
import l3p from "./assets/images/l3p.png";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import { useWindowWidthAndHeight } from "./hooks/useWindowWidthAndHeight";
import { isProdEnv } from "./constants/constants";

const { Header, Footer } = Layout;

const styles = {
  layout: {
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    fontFamily: "Sora, sans-serif"
  },
  wrapper: {
    position: "fixed",
    width: "100%",
    top: 0,
    marginBottom: "100px !important"
  },
  header: {
    zIndex: 1,
    width: "100%",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 20px",
    paddingTop: "15px"
  },
  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600"
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#041836",
    marginBlock: "100px 70px",
    padding: "10px",
    overflow: "auto"
  },
  footer: {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    bottom: "0",
    fontWeight: "800",
    backgroundColor: "transparent"
  },
  adminButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer",
    borderRadius: "25px",
    width: "100px",
    height: "40px"
  }
} as const;

function App() {
  if (!window.Buffer) window.Buffer = Buffer;
  const { account, provider, chainId, isActive } = useWeb3React();
  const [isOwnerPaneOpen, setIsOwnerPaneOpen] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [, setOwnerAddress] = useState<string>();
  const [isSupportedChain, setIsSupportedChain] = useState<boolean>(true);
  const [width] = useWindowWidthAndHeight();

  const isMobile = width <= 750;

  const openAdminPane = () => {
    if (!isOwnerPaneOpen) {
      setIsOwnerPaneOpen(true);
    } else setIsOwnerPaneOpen(false);
  };

  useEffect(() => {
    const launchApp = async () => {
      setIsOwner(false);
      const isBSC: boolean = chainId === 56 || chainId === 97 ? true : false;
      if (isActive && account && isBSC) {
        const owner: string = await getAdminAddress(provider);

        if (account.toLowerCase() === owner?.toLowerCase()) {
          setIsOwner(true);
          setOwnerAddress(account);
          setIsOwnerPaneOpen(false);
        }
      }
    };
    launchApp();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, account, chainId]);

  useEffect(() => {
    if (chainId) {
      if (isProdEnv && chainId === 56) {
        setIsSupportedChain(true);
      } else if (!isProdEnv && chainId === 97) {
        setIsSupportedChain(true);
      } else setIsSupportedChain(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

  return (
    <Layout style={styles.layout}>
      <div style={styles.wrapper}>
        {chainId && !isSupportedChain && <ChainVerification />}
        <Header style={styles.header}>
          {isMobile ? <LogoMin /> : <Logo />}

          <div style={{ ...styles.headerRight, paddingRight: isMobile ? "0" : "20px" }}>
            {isOwner && isActive && (
              <button style={styles.adminButton} onClick={openAdminPane}>
                Admin
              </button>
            )}
            {/* <ChainSelector /> */}
            <ConnectAccount />
          </div>
        </Header>
      </div>
      {chainId && !isSupportedChain && <div style={{ marginBottom: "51px" }}></div>}
      <div style={styles.content}>
        {isOwner && isOwnerPaneOpen ? (
          <AdminPane setOwnerAddress={setOwnerAddress} setIsOwnerPaneOpen={setIsOwnerPaneOpen} />
        ) : (
          <DisplayPane />
        )}
      </div>

      <Footer style={styles.footer}>
        <div style={{ display: "block" }}>
          Powered By{" "}
          <a href="https://www.lepricon.io/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "18px" }}>
            Lepricon.io
          </a>
        </div>
      </Footer>
    </Layout>
  );
}

export const Logo = () => <img src={LepriconLogo_Black} alt="LepriconLogo_Black" width="130px" />;
export const LogoMin = () => <img src={l3p} alt="LepriconLogo_small" width="40px" />;

export default App;
