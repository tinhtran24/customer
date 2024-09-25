"use client";
import { Flex, Skeleton } from "antd";
import React from "react";

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

interface StatusFilterProps {
  handleFilter: (status: string) => void;
  status: { key: string; value: string }[];
  isLoading: boolean;
}
export function StatusFilter({
  handleFilter,
  status,
  isLoading,
}: StatusFilterProps) {
  if (isLoading) return <Skeleton active paragraph={{ rows: 1 }} />;

  if (!status || status.length === 0) return <></>;

  return (
    <Flex wrap="wrap">
      <div
        style={{
          position: "relative",
          padding: "5px 5px 5px 0",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            border: "1px solid gray",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
          onClick={() => handleFilter("")}
        >
          <div style={{ color: "gray", fontWeight: "600" }}>Tất cả</div>
        </div>
      </div>
      {status.map((s, index) => (
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
            onClick={() => handleFilter(s.key)}
          >
            <div
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
              {s.value}
            </div>
            <div style={{ color: "white" }}> {s.key}</div>
          </div>
        </div>
      ))}
    </Flex>
  );
}
