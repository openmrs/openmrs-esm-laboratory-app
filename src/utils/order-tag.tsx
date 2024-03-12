import React from "react";
import { Tag } from "@carbon/react";

export const OrderTag = (order: any) => {
  if (
    (order?.action === "NEW" || order?.action === "REVISE") &&
    order.dateStopped === null
  ) {
    return (
      <Tag
        style={{
          background: "#6F6F6F",
          color: "white",
        }}
        role="tooltip"
        key={order?.uuid}
      >
        {order?.display}
      </Tag>
    );
  } else if (order?.action === "DISCONTINUE" && order.dateStopped === null) {
    return (
      <Tag
        style={{
          background: "green",
          color: "white",
        }}
        role="tooltip"
        key={order?.uuid}
      >
        {order?.display}
      </Tag>
    );
  }
};
