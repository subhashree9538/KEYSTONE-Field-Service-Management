import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [timeLogs, setTimeLogs] = useState<any[]>([]);

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
        "http://localhost:8094/api/auth/login",
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
        "http://localhost:8094/api/work-orders",
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
        "http://localhost:8094/api/work-orders/" +
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
        "http://localhost:8094/api/users",
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
        "http://localhost:8094/api/customers",
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
        "http://localhost:8094/api/sites",
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
        "http://localhost:8094/api/time-logs",
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

  // ================= LOAD ALL DATA =================

  useEffect(() => {
    if (loggedIn) {
      loadWorkOrders();
      loadTechnicians();
      loadCustomers();
      loadSites();
      loadTimeLogs();
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
        "http://localhost:8094/api/work-orders/" +
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
        "http://localhost:8094/api/work-orders/" +
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

        {/* DASHBOARD */}

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

        {/* WORK ORDERS */}

        <section className="section">

          <h2>Work Orders</h2>

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

                          {Object.entries(item).map(
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