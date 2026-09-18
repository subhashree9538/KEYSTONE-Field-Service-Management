import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showCreateWorkOrder, setShowCreateWorkOrder] = useState(false);

const [newWorkOrder, setNewWorkOrder] = useState({
  title: "",
  description: "",
  priority: "MEDIUM",
  customerId: "",
  siteId: "",
  slaDueDate: "",
});
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
const [showParts, setShowParts] = useState(false);
const [partName, setPartName] = useState("");
const [partQuantity, setPartQuantity] = useState("");
const [partPrice, setPartPrice] = useState("");
const [showCustomerPortal, setShowCustomerPortal] = useState(false);
const [selectedCustomerId, setSelectedCustomerId] = useState("");
const [customerWorkOrders, setCustomerWorkOrders] = useState<any[]>([]);

  const [history, setHistory] = useState<{
    [key: number]: any[];
  }>({});

  const [loading, setLoading] = useState(false);

  const [showCustomers, setShowCustomers] = useState(false);
  const [showSites, setShowSites] = useState(false);
  const [showTimeLogs, setShowTimeLogs] = useState(false);

  // ================= LOGIN =================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
		const response = await fetch(
		  "https://keystone-backend-jxxj.onrender.com/api/auth/login",
		  {
		    method: "POST",
		    headers: {
		      "Content-Type": "application/json",
		    },
		    body: JSON.stringify({
		      username,
		      password,
		    }),
		  }
		);

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const token = await response.text();

      localStorage.setItem("token", token);
      setLoggedIn(true);
    } catch (error) {
      setError(
        "Login failed. Please check username and password."
      );
    }
  };

  // ================= WORK ORDERS =================

  const loadWorkOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/work-orders",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load work orders");
      }

      const data = await response.json();
      setWorkOrders(data);

      // Load history for every work order
      for (const workOrder of data) {
        loadHistory(workOrder.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ================= WORK ORDER HISTORY =================

  const loadHistory = async (workOrderId: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/work-orders/" +
          workOrderId +
          "/history",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setHistory((previous) => ({
        ...previous,
        [workOrderId]: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // ================= TECHNICIANS =================

  const loadTechnicians = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/users",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load technicians");
      }

      const data = await response.json();

      const technicianUsers = data.filter(
        (user: any) => user.role === "TECHNICIAN"
      );

      setTechnicians(technicianUsers);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= CUSTOMERS =================

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/customers",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= SITES =================

  const loadSites = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/sites",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load sites");
      }

      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= TIME LOGS =================

  const loadTimeLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/time-logs",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load time logs");
      }

      const data = await response.json();
      setTimeLogs(data);
    } catch (error) {
      console.error(error);
    }
  };
  // ================= PARTS =================

const loadParts = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://https://keystone-backend-jxxj.onrender.com/api/parts",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load parts");
    }

    const data = await response.json();
    setParts(data);
  } catch (error) {
    console.error(error);
  }
};
  const addPart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/parts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: partName,
            quantity: Number(partQuantity),
            price: Number(partPrice),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add part");
      }

      setPartName("");
      setPartQuantity("");
      setPartPrice("");

      await loadParts();

      alert("Part added successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to add part");
    }
  };
  const createWorkOrder = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!newWorkOrder.title || !newWorkOrder.description) {
      alert("Please enter Title and Description");
      return;
    }

    if (!newWorkOrder.customerId || !newWorkOrder.siteId) {
      alert("Please select Customer and Site");
      return;
    }

    const response = await fetch(
      "http://https://keystone-backend-jxxj.onrender.com/api/work-orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: newWorkOrder.title,
          description: newWorkOrder.description,
          priority: newWorkOrder.priority,
          status: "NEW",
          slaDueDate: newWorkOrder.slaDueDate
            ? newWorkOrder.slaDueDate
            : null,
          customer: {
            id: Number(newWorkOrder.customerId),
          },
          site: {
            id: Number(newWorkOrder.siteId),
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create work order");
    }

    alert("Work Order created successfully!");

    setNewWorkOrder({
      title: "",
      description: "",
      priority: "MEDIUM",
      customerId: "",
      siteId: "",
      slaDueDate: "",
    });

    setShowCreateWorkOrder(false);

    loadWorkOrders();
  } catch (error) {
    console.error(error);
    alert("Failed to create Work Order");
  }
};
    // ================= CUSTOMER PORTAL =================

  const loadCustomerWorkOrders = async (
    customerId: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/customer-portal/" +
          customerId +
          "/work-orders",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load customer work orders"
        );
      }

      const data = await response.json();
      setCustomerWorkOrders(data);
    } catch (error) {
      console.error(error);
      setCustomerWorkOrders([]);
      alert("Failed to load customer work orders");
    }
  };
  const [notifications, setNotifications] = useState<any[]>([]);
const [showNotifications, setShowNotifications] = useState(false);
const [auditLogs, setAuditLogs] = useState<any[]>([]);
const [showAuditLogs, setShowAuditLogs] = useState(false);

  // ================= NOTIFICATIONS =================

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/notifications",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };
  // ================= AUDIT LOGS =================

const loadAuditLogs = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://https://keystone-backend-jxxj.onrender.com/api/audit-logs",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load audit logs");
    }

    const data = await response.json();
    setAuditLogs(data);
  } catch (error) {
    console.error(error);
  }
};

  // ================= LOAD ALL DATA =================

useEffect(() => {
  if (loggedIn) {
    loadWorkOrders();
    loadTechnicians();
    loadCustomers();
    loadSites();
    loadTimeLogs();
    loadParts();
        loadNotifications();
        loadAuditLogs();
  }
}, [loggedIn]);
  // ================= UPDATE STATUS =================

  const updateStatus = async (
    workOrderId: number,
    newStatus: string
  ) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://https://keystone-backend-jxxj.onrender.com/api/work-orders/" +
          workOrderId +
          "/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Status update failed"
        );
      }

      await loadWorkOrders();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= ASSIGN TECHNICIAN =================

  const assignTechnician = async (
  workOrderId: number,
  technicianId: number
) => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://https://keystone-backend-jxxj.onrender.com/api/work-orders/" +
        workOrderId +
        "/assign/" +
        technicianId,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        message || "Technician assignment failed"
      );
    }

    await loadWorkOrders();

    // Refresh notifications after technician assignment
    await loadNotifications();

  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  // ================= LOGIN PAGE =================

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>KEYSTONE</h1>

          <p>
            Field Service Management Platform
          </p>

          <form onSubmit={handleLogin}>
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              required
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              required
            />

            {error && (
              <p className="error">{error}</p>
            )}

            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD COUNTS =================

  const totalJobs = workOrders.length;

  const completedJobs = workOrders.filter(
    (wo) =>
      wo.status === "COMPLETED" ||
      wo.status === "CLOSED"
  ).length;

  const openJobs = workOrders.filter(
    (wo) =>
      wo.status !== "COMPLETED" &&
      wo.status !== "CLOSED" &&
      wo.status !== "CANCELLED"
  ).length;

  const overdueJobs = workOrders.filter((wo) => {
    if (!wo.slaDueDate) {
      return false;
    }

    return (
      new Date(wo.slaDueDate) < new Date() &&
      wo.status !== "COMPLETED" &&
      wo.status !== "CLOSED"
    );
  }).length;

  // ================= DASHBOARD =================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div>
          <h1>KEYSTONE</h1>

          <p>
            Field Service Management Platform
          </p>
        </div>

        <button
          className="logout"
          onClick={() => {
  localStorage.removeItem("token");
  setLoggedIn(false);
}}
        >
          Logout
        </button>
      </header>

      <main className="container">

        

        <h2>Dashboard</h2>

        <div className="cards">

          <div className="card">
            <span>Total Jobs</span>
            <strong>{totalJobs}</strong>
          </div>

          <div className="card">
            <span>Completed Jobs</span>
            <strong>{completedJobs}</strong>
          </div>

          <div className="card">
            <span>Open Jobs</span>
            <strong>{openJobs}</strong>
          </div>

          <div className="card">
            <span>Overdue Jobs</span>
            <strong>{overdueJobs}</strong>
          </div>

        </div>
                {/* STATUS SUMMARY */}

        <section className="section">

          <div className="section-header">
            <h2>Work Order Status Summary</h2>
          </div>

          <div className="cards">

            <div className="card">
              <span>NEW</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "NEW"
                ).length}
              </strong>
            </div>

            <div className="card">
              <span>ASSIGNED</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "ASSIGNED"
                ).length}
              </strong>
            </div>

            <div className="card">
              <span>IN PROGRESS</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "IN_PROGRESS"
                ).length}
              </strong>
            </div>

            <div className="card">
              <span>COMPLETED</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "COMPLETED"
                ).length}
              </strong>
            </div>

            <div className="card">
              <span>CLOSED</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "CLOSED"
                ).length}
              </strong>
            </div>

            <div className="card">
              <span>ON HOLD</span>
              <strong>
                {workOrders.filter(
                  (wo) => wo.status === "ON_HOLD"
                ).length}
              </strong>
            </div>

          </div>

        </section>
                {/* RECENT WORK ORDERS */}

        <section className="section">

          <div className="section-header">
            <h2>Recent Work Orders</h2>
          </div>

          {workOrders.length === 0 ? (

            <p>No work orders found.</p>

          ) : (

            <div className="module-list">

              {workOrders
                .slice(-5)
                .reverse()
                .map((workOrder) => (

                  <div
                    className="module-item"
                    key={workOrder.id}
                  >

                    <h3>
                      {workOrder.title}
                    </h3>

                    <p>
                      Work Order: {workOrder.code}
                    </p>

                    <p>
                      Status: {workOrder.status}
                    </p>

                    <p>
                      Priority: {workOrder.priority}
                    </p>

                    <p>
                      Technician:{" "}
                      {workOrder.technician
                        ? workOrder.technician.username
                        : "Not Assigned"}
                    </p>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* CUSTOMERS */}

        <section className="section">

          <div className="section-header">
            <h2>Customers</h2>

            <button
              onClick={() =>
                setShowCustomers(!showCustomers)
              }
            >
              {showCustomers
                ? "Hide Customers"
                : "View Customers"}
            </button>
          </div>

          {showCustomers && (
            <div className="module-list">

              {customers.length === 0 ? (
                <p>No customers found.</p>
              ) : (
                customers.map((customer) => (
                  <div
                    className="module-item"
                    key={customer.id}
                  >
                    <h3>
                      {customer.name}
                    </h3>

                    <p>
                      Customer ID: {customer.id}
                    </p>

                    {customer.email && (
                      <p>
                        Email: {customer.email}
                      </p>
                    )}

                    {customer.phone && (
                      <p>
                        Phone: {customer.phone}
                      </p>
                    )}
                  </div>
                ))
              )}

            </div>
          )}

        </section>

        {/* SITES */}

        <section className="section">

          <div className="section-header">
            <h2>Sites</h2>

            <button
              onClick={() =>
                setShowSites(!showSites)
              }
            >
              {showSites
                ? "Hide Sites"
                : "View Sites"}
            </button>
          </div>

          {showSites && (
            <div className="module-list">

              {sites.length === 0 ? (
                <p>No sites found.</p>
              ) : (
                sites.map((site) => (
                  <div
                    className="module-item"
                    key={site.id}
                  >
                    <h3>
                      {site.name}
                    </h3>

                    <p>
                      Site ID: {site.id}
                    </p>

                    {site.address && (
                      <p>
                        Address: {site.address}
                      </p>
                    )}

                    {site.city && (
                      <p>
                        City: {site.city}
                      </p>
                    )}

                  </div>
                ))
              )}

            </div>
          )}

        </section>

        {/* TIME LOGS */}

        <section className="section">

          <div className="section-header">

            <h2>Time Logs</h2>

            <button
              onClick={() =>
                setShowTimeLogs(!showTimeLogs)
              }
            >
              {showTimeLogs
                ? "Hide Time Logs"
                : "View Time Logs"}
            </button>

          </div>

          {showTimeLogs && (
            <div className="module-list">

              {timeLogs.length === 0 ? (
                <p>No time logs found.</p>
              ) : (
                timeLogs.map((log, index) => (

                  <div
                    className="module-item"
                    key={log.id ?? index}
                  >

                    <h3>
                      Time Log #{log.id ?? index + 1}
                    </h3>

                    {Object.entries(log).map(
                      ([key, value]) => (

                        <p key={key}>
                          <strong>
                            {key}:
                          </strong>{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>

                      )
                    )}

                  </div>

                ))
              )}

            </div>
          )}

        </section>
                {/* PARTS */}
                {/* CUSTOMER PORTAL */}

<section className="section">

  <div className="section-header">

    <h2>Customer Portal</h2>

    <button
      onClick={() =>
        setShowCustomerPortal(!showCustomerPortal)
      }
    >
      {showCustomerPortal
        ? "Hide Customer Portal"
        : "View Customer Portal"}
    </button>

  </div>

  {showCustomerPortal && (

    <div className="module-list">

      <select
        value={selectedCustomerId}
        onChange={(e) => {
          const customerId = e.target.value;

          setSelectedCustomerId(customerId);

          if (customerId) {
            loadCustomerWorkOrders(customerId);
          } else {
            setCustomerWorkOrders([]);
          }
        }}
      >

        <option value="">
          Select Customer
        </option>

        {customers.map((customer) => (

          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name}
          </option>

        ))}

      </select>

      {selectedCustomerId && (

        <>

          <h3>Customer Work Orders</h3>

          {customerWorkOrders.length === 0 ? (

            <p>
              No work orders found for this customer.
            </p>

          ) : (

            customerWorkOrders.map((wo) => (

              <div
                className="module-item"
                key={wo.id}
              >

                <h3>
                  {wo.title}
                </h3>

                <p>
                  Work Order: {wo.code}
                </p>

                <p>
                  Status: {wo.status}
                </p>

                <p>
                  Priority: {wo.priority}
                </p>

                {wo.description && (
                  <p>
                    Description: {wo.description}
                  </p>
                )}

              </div>

            ))

          )}

        </>

      )}

    </div>

  )}

</section>

        <section className="section">
          <div className="add-part-form">

  <h3>Add New Part</h3>

  <input
    type="text"
    placeholder="Part Name"
    value={partName}
    onChange={(e) => setPartName(e.target.value)}
  />

  <input
    type="number"
    placeholder="Quantity"
    value={partQuantity}
    onChange={(e) => setPartQuantity(e.target.value)}
  />

  <input
    type="number"
    placeholder="Price"
    value={partPrice}
    onChange={(e) => setPartPrice(e.target.value)}
  />

  <button
    onClick={addPart}
    disabled={!partName || !partQuantity || !partPrice}
  >
    Add Part
  </button>

</div>

          <div className="section-header">

            <h2>Parts</h2>

            <button
              onClick={() =>
                setShowParts(!showParts)
              }
            >
              {showParts
                ? "Hide Parts"
                : "View Parts"}
            </button>

          </div>

          {showParts && (
            <div className="module-list">

              {parts.length === 0 ? (
                <p>No parts found.</p>
              ) : (
                parts.map((part) => (

                  <div
                    className="module-item"
                    key={part.id}
                  >

                    <h3>
                      {part.name}
                    </h3>

                    <p>
                      Part ID: {part.id}
                    </p>

                    <p>
                      Quantity: {part.quantity}
                    </p>

                    <p>
                      Price: ₹{part.price}
                    </p>

                  </div>

                ))
              )}

            </div>
          )}

        </section>
        {/* NOTIFICATIONS */}

<section className="section">

  <div className="section-header">

    <h2>Notifications</h2>

    <button
      onClick={() =>
        setShowNotifications(!showNotifications)
      }
    >
      {showNotifications
        ? "Hide Notifications"
        : "View Notifications"}
    </button>

  </div>

  {showNotifications && (

    <div className="module-list">

      {notifications.length === 0 ? (

        <p>No notifications found.</p>

      ) : (

        notifications.map((notification, index) => (

          <div
            className="module-item"
            key={notification.id ?? index}
          >

            <h3>
              Notification #{notification.id ?? index + 1}
            </h3>

            {Object.entries(notification).map(
              ([key, value]) => (

                <p key={key}>
                  <strong>
                    {key}:
                  </strong>{" "}
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </p>

              )
            )}

          </div>

        ))

      )}

    </div>

  )}

</section>
{/* AUDIT LOGS */}

<section className="section">

  <div className="section-header">

    <h2>Audit Logs</h2>

    <button
      onClick={() =>
        setShowAuditLogs(!showAuditLogs)
      }
    >
      {showAuditLogs
        ? "Hide Audit Logs"
        : "View Audit Logs"}
    </button>

  </div>

  {showAuditLogs && (

    <div className="module-list">

      {auditLogs.length === 0 ? (

        <p>No audit logs found.</p>

      ) : (

        auditLogs.map((log, index) => (

          <div
            className="module-item"
            key={log.id ?? index}
          >

            <h3>
              Audit Log #{log.id ?? index + 1}
            </h3>

            {Object.entries(log).map(
              ([key, value]) => (

                <p key={key}>
                  <strong>
                    {key}:
                  </strong>{" "}
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </p>

              )
            )}

          </div>

        ))

      )}

    </div>

  )}

</section>


        {/* WORK ORDERS */}

<section className="section">

  <div className="section-header">
    <h2>Work Orders</h2>

    <button
      onClick={() =>
        setShowCreateWorkOrder(!showCreateWorkOrder)
      }
    >
      {showCreateWorkOrder
        ? "Cancel"
        : "Create Work Order"}
    </button>
  </div>
  {showCreateWorkOrder && (
  <div className="module-item">

    <h3>Create New Work Order</h3>

    <input
      type="text"
      placeholder="Work Order Title"
      value={newWorkOrder.title}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          title: e.target.value,
        })
      }
    />

    <textarea
      placeholder="Work Order Description"
      value={newWorkOrder.description}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          description: e.target.value,
        })
      }
    />

    <select
      value={newWorkOrder.priority}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          priority: e.target.value,
        })
      }
    >
      <option value="LOW">LOW</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="HIGH">HIGH</option>
      <option value="URGENT">URGENT</option>
    </select>

    <select
      value={newWorkOrder.customerId}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          customerId: e.target.value,
        })
      }
    >
      <option value="">Select Customer</option>

      {customers.map((customer) => (
        <option
          key={customer.id}
          value={customer.id}
        >
          {customer.name}
        </option>
      ))}
    </select>

    <select
      value={newWorkOrder.siteId}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          siteId: e.target.value,
        })
      }
    >
      <option value="">Select Site</option>

      {sites.map((site) => (
        <option
          key={site.id}
          value={site.id}
        >
          {site.name}
        </option>
      ))}
    </select>

    <label>SLA Due Date</label>

    <input
      type="datetime-local"
      value={newWorkOrder.slaDueDate}
      onChange={(e) =>
        setNewWorkOrder({
          ...newWorkOrder,
          slaDueDate: e.target.value,
        })
      }
    />

    <button
      onClick={createWorkOrder}
      disabled={
        !newWorkOrder.title ||
        !newWorkOrder.description ||
        !newWorkOrder.customerId ||
        !newWorkOrder.siteId
      }
    >
      Create Work Order
    </button>

  </div>
)}

          {workOrders.length === 0 ? (
            <p>No work orders found.</p>
          ) : (
            workOrders.map((workOrder) => (

              <div
                className="work-order"
                key={workOrder.id}
              >

                <div>

                  <h3>
                    {workOrder.title}
                  </h3>

                  <p>
                    {workOrder.code}
                  </p>

                  <p>
                    {workOrder.description}
                  </p>

                </div>

                <div className="details">

                  <span className="priority">
                    Priority:{" "}
                    {workOrder.priority}
                  </span>

                  <span className="status">
                    Status:{" "}
                    {workOrder.status}
                  </span>

                  <p>
                    Technician:{" "}
                    {workOrder.technician
                      ? workOrder.technician.username
                      : "Not Assigned"}
                  </p>

                  <div className="actions">

                    {/* ASSIGN */}

                    {workOrder.status === "NEW" && (
                      <div>

                        <select
                          defaultValue=""
                          disabled={loading}
                          onChange={(e) => {

                            const technicianId =
                              Number(
                                e.target.value
                              );

                            if (technicianId) {
                              assignTechnician(
                                workOrder.id,
                                technicianId
                              );
                            }

                          }}
                        >

                          <option value="">
                            Select Technician
                          </option>

                          {technicians.map(
                            (technician) => (

                              <option
                                key={
                                  technician.id
                                }
                                value={
                                  technician.id
                                }
                              >
                                {
                                  technician.username
                                }
                              </option>

                            )
                          )}

                        </select>

                      </div>
                    )}

                    {/* START WORK */}

                    {workOrder.status ===
                      "ASSIGNED" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            workOrder.id,
                            "IN_PROGRESS"
                          )
                        }
                        disabled={loading}
                      >
                        Start Work
                      </button>
                    )}

                    {/* COMPLETE */}

                    {workOrder.status ===
                      "IN_PROGRESS" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            workOrder.id,
                            "COMPLETED"
                          )
                        }
                        disabled={loading}
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* CLOSE */}

                    {workOrder.status ===
                      "COMPLETED" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            workOrder.id,
                            "CLOSED"
                          )
                        }
                        disabled={loading}
                      >
                        Close Work Order
                      </button>
                    )}

                  </div>

                </div>

                {/* HISTORY */}

<div className="history">

  <h4>Status History</h4>

  {!history[workOrder.id] ||
  history[workOrder.id].length === 0 ? (
    <p>No history found.</p>
  ) : (
    history[workOrder.id].map(
      (item: any, index: number) => (

        <div
          className="history-item"
          key={item.id ?? index}
        >

          <p>
            <strong>Change:</strong>{" "}
            {item.fromStatus} → {item.toStatus}
          </p>

          <p>
            <strong>Changed By:</strong>{" "}
            {item.changedBy || "Unknown"}
          </p>

          <p>
            <strong>Changed At:</strong>{" "}
            {item.changedAt
              ? new Date(item.changedAt).toLocaleString()
              : "N/A"}
          </p>

          {item.note && (
            <p>
              <strong>Note:</strong> {item.note}
            </p>
          )}

        </div>

      )
    )
  )}

</div>

                
              </div>

            ))
          )}

        </section>

      </main>

    </div>
  );
}

export default App;