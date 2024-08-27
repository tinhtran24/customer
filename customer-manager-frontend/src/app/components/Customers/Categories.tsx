import { Flex } from "antd";
import React from "react";
import { ENUM_STATUS_TYPE } from "@/app/lib/definitions";

const colors = [
  "#3a87ad",
  "#0cafd2",
  "#f69045",
  "#008449",
  "#be2e2e",
  "#4d4f5c",
  "#ffcc00",
  "#ef5316",
  "#01bb0c",
];

interface CategoriesProps {
  setCategory: any;
}
export function Categories({ setCategory }: CategoriesProps) {
  const categories = Object.keys(ENUM_STATUS_TYPE) as Array<
    keyof typeof ENUM_STATUS_TYPE
  >;
  return (
    <Flex wrap="wrap">
       <div
          style={{ position: "relative", padding: "5px", cursor: "pointer" }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
              border: "1px solid gray"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0px 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => setCategory("")}
          >
            
            <div style={{ color: "gray", fontWeight: "600" }}>Tất cả</div>
          </div>
        </div>
      {categories.map((category, index) => (
        <div
          key={index}
          style={{ position: "relative", padding: "5px", cursor: "pointer" }}
        >
          <div
            style={{
              backgroundColor: colors[index % colors.length],
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0px 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => setCategory(category)}
          >
            {/* <div
              style={{
                padding: "3px 5px",
                fontSize: "12px",
                background: "#ef5316",
                color: "white",
                border: "1px solid white",
                borderRadius: "12px",
                position: "absolute",
                top: "-10px",
                right: "0",
              }}
            >
              {category.total}
            </div> */}
            <div style={{ color: "white" }}> {ENUM_STATUS_TYPE[category]}</div>
          </div>
        </div>
      ))}
    </Flex>
  );
}
