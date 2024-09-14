import { useState } from "react";
import { useMap } from "@mappedin/react-sdk";
import { MapFloor } from "./map.component";

export default function FloorSelector() {
    const { mapView } = useMap();
    const [selectedMap, setSelectedMap] = useState(MapFloor.Floor2);
  
    mapView.auto();
    // setSelectedMap(MapFloor.Floor2);

    // const downloadJSON = () => {
    //   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapData.getByType("space")));
    //   const downloadAnchorNode = document.createElement('a');
    //   downloadAnchorNode.setAttribute("href", dataStr);
    //   downloadAnchorNode.setAttribute("download", "mapDataLog.json");
    //   document.body.appendChild(downloadAnchorNode);
    //   downloadAnchorNode.click();
    //   downloadAnchorNode.remove();
    // };
  
    const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedFloor = event.target.value as MapFloor;
      setSelectedMap(selectedFloor);
      mapView.setFloor(selectedFloor);
    };
  
    return (
      <>
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
          color: "black",
        }}>
          <select value={selectedMap} onChange={handleMapChange} style={{
              background: "rgba(255, 255, 255, 0.8)",
              color: "black",
            }}>
            <option value={MapFloor.Floor1}>Floor 1</option>
            <option value={MapFloor.Floor2}>Floor 2</option>
            <option value={MapFloor.Floor3}>Floor 3</option>
            <option value={MapFloor.Floor4}>Floor 4</option>
            <option value={MapFloor.Floor5}>Floor 5</option>
            <option value={MapFloor.Floor6}>Floor 6</option>
            <option value={MapFloor.Floor7}>Floor 7</option>
          </select>
          {/* <button onClick={downloadJSON} style={{ marginLeft: "10px" }}>
          Download JSON
        </button> */}
        </div>
        
      </>
    );
  }