import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import { ApiTwoTone, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      //   const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = "https://dashboard.stripe.com/test/payments";
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Unable to access Payout Settings. Try again later.");
    }
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-8">
          <div className="col-md-8 offset-md-2 bg-light p-5 ">
            <h1>₹ Revenue report ₹ </h1>
            <h3 style={{ textAlign: "center" }}>
              You get paid directly from Stripe every 2 days
            </h3>
            <hr />
            {/* <pre> {JSON.stringify(balance, null, 4)}</pre> */}
            <h4>
              Pending
              balance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {balance.pending &&
                balance.pending.map(
                  (
                    bp, // bp == balance pending
                    i
                  ) => (
                    <span key={i} className="float-right">
                      {stripeCurrencyFormatter(bp)}
                    </span>
                  )
                )}
            </h4>
            <medium>For the last 48 hours</medium>
            <hr />

            {/* <pre> {JSON.stringify(balance, null, 4)}</pre> */}
            <h4>
              Payouts &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp; &nbsp; &nbsp;
              {!loading ? (
                <h7>
                  <ApiTwoTone
                    twoToneColor="#eb2f96"
                    className="float-right primary pointer"
                    onClick={handlePayoutSettings}
                  />
                </h7>
              ) : (
                <SyncOutlined spin className="float-right pointer" />
              )}
            </h4>
            <medium>Click on the icon to visit your payments</medium>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
