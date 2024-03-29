import { useEffect, useState } from "react";
import { Select, Button, Tag, ConfigProvider } from "antd";

import { useRecoilState } from "recoil";
import { metric, channel } from "./atom/atom";
import "./css/Input.css";



const getChannel = async () => {
  const response = await fetch("https://data-api-vpq8.onrender.com/channels");
  const data = await response.json();

  const val = data.data.map((item: any) => ({
    label: item,

    value: item,
  }));

  return val;
};

const Input = ({
  handleMenuClick,
}: {
  handleMenuClick: (arg: string) => void;
}) => {
  const [channelId, setChannelId] = useRecoilState(channel);
  const [options, setOptions] = useState<{ value: string; label: string }[]>();
  const [plainOptions, setPlainOptions] = useRecoilState(metric);

  const handleChange = async (value: string) => {
    setChannelId(value);

    const response = await fetch(
      `https://data-api-vpq8.onrender.com/metrics?channel_id=${value}`
    );
    const data = await response.json();

    const val = data.data.map((item: any) => {});
    setPlainOptions(data.data);
    console.log(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChannel();
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="select">
        <h2>Select Channel</h2>
        <Select
          size="large"
          style={{ width: "10rem" }}
          onChange={handleChange}
          options={options}
        />
      </div>

      <div className="significantMetricContainer">
        <h2>Metrics with significant changes</h2>
        <ConfigProvider
          theme={{
            token: {
              fontSize: 22,
            },
          }}
        >
          {plainOptions.map((item, index) => {
            return (
              <Tag color="green" style={{ margin: "3px" }} key={index}>
                {item}
              </Tag>
            );
          })}
          {channelId && plainOptions.length === 0 && (
            <Tag color="red">No metrics available for this channel</Tag>
          )}
        </ConfigProvider>
      </div>

      <ConfigProvider
        theme={{
          token: {
            fontSize: 20,
          },
        }}
      >
        <Button onClick={() => handleMenuClick("2")}>Show Graphs</Button>
      </ConfigProvider>
    </div>
  );
};

export default Input;
