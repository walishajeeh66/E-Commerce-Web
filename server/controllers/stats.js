const prisma = require("../utills/db");
const fs = require("fs");
const path = require("path");

async function getVisitorsToday() {
  try {
    const logPath = path.join(__dirname, "..", "logs", "access.log");
    if (!fs.existsSync(logPath)) return 0;
    const content = fs.readFileSync(logPath, "utf8");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const datePrefix = `${yyyy}-${mm}-${dd}`; // assuming ISO timestamps in logs
    const lines = content.split("\n");
    let count = 0;
    for (const line of lines) {
      if (line.includes(datePrefix)) count++;
    }
    return count;
  } catch {
    return 0;
  }
}

async function getStats(req, res) {
  try {
    const [totalOrders, pendingOrders, deliveredOrders, cancelledOrders, revenueAgg] = await Promise.all([
      prisma.customer_order.count(),
      prisma.customer_order.count({ where: { status: { equals: "pending" } } }),
      prisma.customer_order.count({ where: { status: { equals: "delivered" } } }),
      prisma.customer_order.count({ where: { status: { in: ["cancelled", "canceled"] } } }),
      prisma.customer_order.aggregate({ _sum: { total: true } })
    ]);

    const totalRevenue = revenueAgg._sum.total || 0;
    const profit = Math.round(totalRevenue * 0.2); // simple proxy without COGS
    const visitorsToday = await getVisitorsToday();

    return res.status(200).json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      profit,
      visitorsToday,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return res.status(500).json({ error: "Failed to compute stats" });
  }
}

module.exports = { getStats };


