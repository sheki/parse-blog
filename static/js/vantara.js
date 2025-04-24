window._vntQueue = window._vntQueue || [];
window.VNT ||= {
  init: function () {
    window._vntQueue.push(["init", Array.prototype.slice.call(arguments)]);
  },
  identify: function () {
    window._vntQueue.push(["identify", Array.prototype.slice.call(arguments)]);
  },
};

console.log("vantara loading");

VNT.init(
  "prd_00000000000000000000000001",
  "key_s/OSk4v2rA72WtID+I9FEz5zITqaf4UUI7diJm1X0hA6WgQgf97crc1eoYZpvXHqpfhNU2IK6To/v7HUknAbXA==",
  {
    environment: "production",
    version: "1.0.0", // optional
    metadata: {
      site: "sheki.in",
    },
  },
);
