"use client";
import { useState } from "react";

interface Administrator {
  ssn: string;
  username: string;
  email: string;
  password: string;
}

export default function AdminCRUD() {
  // Create form state
  const [createSsn, setCreateSsn] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  // GET form state
  const [getSsn, setGetSsn] = useState("");
  const [adminData, setAdminData] = useState<Administrator | null>(null);

  // DELETE form state
  const [deleteSsn, setDeleteSsn] = useState("");

  // Update form state
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");

  // Base URL for API endpoints
  const baseUrl = "http://localhost:3000/api/admin/account";

  // Create admin
  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ssn: createSsn,
          username: createUsername,
          email: createEmail,
          password: createPassword,
        }),
      });
      const data = await response.json();
      console.log("Created Admin:", data);
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  // Get admin by SSN
  const getAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/api/admin/account?ssn=${encodeURIComponent(getSsn)}`;
      const response = await fetch(url, { method: "GET", headers: { "Content-type": "application/json"}});
      const data = await response.json();
      setAdminData(data);
      console.log("Fetched Admin:", data);
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  // Delete admin by SSN
  const deleteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/admin/account?ssn=${deleteSsn}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Deleted Admin:", data);
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  // Update admin (requires previously fetched admin via GET)
  const updateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!adminData) {
    alert("Please fetch an admin (using GET) before updating.");
    return;
  }
  
  const payload = {
    ssn: adminData.ssn,
    username: updateUsername,
    email: updateEmail,
    password: updatePassword,
  };
  console.log("Update Payload:", payload);
  
  try {
    const response = await fetch(baseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("Updated Admin:", data);
    setAdminData(data); // update the state if needed
  } catch (error) {
    console.error("Error updating admin:", error);
  }
};

  return (
    <div>
      <h1>Administrator CRUD</h1>

      {/* Create Administrator Section */}
      <section>
        <h2>Create Administrator</h2>
        <form onSubmit={createAdmin}>
          <input
            type="text"
            placeholder="SSN"
            value={createSsn}
            onChange={(e) => setCreateSsn(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={createUsername}
            onChange={(e) => setCreateUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={createPassword}
            onChange={(e) => setCreatePassword(e.target.value)}
            required
          />
          <button type="submit">
            Create
          </button>
        </form>
      </section>

      {/* Get Administrator Section */}
      <section>
        <h2>Get Administrator</h2>
        <form onSubmit={getAdmin}>
          <input
            type="text"
            placeholder="SSN"
            value={getSsn}
            onChange={(e) => setGetSsn(e.target.value)}
            required
          />
          <button type="submit">
            Get
          </button>
        </form>
        {adminData && (
          <div>
            <h3>Admin Details</h3>
            <p>SSN: {adminData.ssn}</p>
            <p>Username: {adminData.username}</p>
            <p>Email: {adminData.email}</p>
          </div>
        )}
      </section>

      {/* Delete Administrator Section */}
      <section>
        <h2>Delete Administrator</h2>
        <form onSubmit={deleteAdmin}>
          <input
            type="text"
            placeholder="SSN"
            value={deleteSsn}
            onChange={(e) => setDeleteSsn(e.target.value)}
            required
          />
          <button type="submit">
            Delete
          </button>
        </form>
      </section>

      {/* Update Administrator Section */}
      <section>
        <h2>Update Administrator</h2>
        <p>
          Note: Use the GET section to load an administrator, then update the
          fields below.
        </p>
        <form onSubmit={updateAdmin}>
          <input
            type="text"
            placeholder="Username"
            value={updateUsername}
            onChange={(e) => setUpdateUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={updatePassword}
            onChange={(e) => setUpdatePassword(e.target.value)}
            required
          />
          <button type="submit">
            Update
          </button>
        </form>
      </section>
    </div>
  );
}
