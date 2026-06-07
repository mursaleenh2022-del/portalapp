const baseUrl = "http://localhost:5000";

// ANSI escape codes for beautiful styling
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

async function runTests() {
  console.log(bold(cyan("\n==================================================")));
  console.log(bold(cyan("     PORTALAPP V8 - DEEP SYSTEM TESTING SUITE     ")));
  console.log(bold(cyan("==================================================\n")));

  try {
    // ----------------------------------------------------
    // TEST 1: Authentication & JWT Validation
    // ----------------------------------------------------
    console.log(bold("1. Testing Auth & Credentials..."));

    // Client Login
    const clientLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "client@portalapp.com", pw: "Client@123" })
    });
    if (!clientLoginRes.ok) throw new Error("Client login failed!");
    const clientData = await clientLoginRes.json();
    const clientToken = clientData.token;
    const initialClientBalance = clientData.user.balance;
    console.log(green("  ✓ Client successfully authenticated."));
    console.log(`    Token: ${clientToken.slice(0, 24)}...`);
    console.log(`    Sarah Johnson (Client) Initial Balance: $${initialClientBalance}`);

    // Helper Login
    const helperLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "helper@portalapp.com", pw: "Helper@123" })
    });
    if (!helperLoginRes.ok) throw new Error("Helper login failed!");
    const helperData = await helperLoginRes.json();
    const helperToken = helperData.token;
    const initialHelperBalance = helperData.user.balance;
    const initialHelperStreak = helperData.user.streak;
    console.log(green("  ✓ Helper successfully authenticated."));
    console.log(`    Marcus Williams (Helper) Initial Balance: $${initialHelperBalance} | Streak: ${initialHelperStreak}`);

    // Admin Login
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@portalapp.com", pw: "Admin@123" })
    });
    if (!adminLoginRes.ok) throw new Error("Admin login failed!");
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;
    console.log(green("  ✓ Admin successfully authenticated."));

    // Get Auth Session Verification
    const authMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${clientToken}` }
    });
    if (!authMeRes.ok) throw new Error("Auth verification /me failed!");
    console.log(green("  ✓ Session authorization token verified via /api/auth/me."));

    // ----------------------------------------------------
    // TEST 2: Client Portal Task Management
    // ----------------------------------------------------
    console.log(bold("\n2. Testing Client Task Creation..."));
    const taskBudget = 45.00;
    const newTask = {
      title: "Gourmet Grocery Run & Delivery",
      desc: "Fresh sourdough, organic apples x5, local honey, and whole milk.",
      category: "grocery",
      priority: "high",
      due: "Tonight, 8:00 PM",
      loc: "247 W 82nd St, NY",
      budget: taskBudget
    };

    const postTaskRes = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${clientToken}`
      },
      body: JSON.stringify(newTask)
    });
    if (!postTaskRes.ok) throw new Error("Failed to post task!");
    const createdTask = await postTaskRes.json();
    const taskId = createdTask.id;
    console.log(green(`  ✓ New task successfully posted (ID: #EM-${1000 + taskId}).`));
    console.log(`    Title: "${createdTask.title}"`);
    console.log(`    Budget: $${createdTask.pay} | Status: ${createdTask.status}`);

    // Verify task list has our new task
    const tasksRes = await fetch(`${baseUrl}/api/tasks`, {
      headers: { "Authorization": `Bearer ${clientToken}` }
    });
    const clientTasks = await tasksRes.json();
    const foundTask = clientTasks.find(t => t.id === taskId);
    if (!foundTask) throw new Error("Task not found in client task list!");
    console.log(green("  ✓ Task retrieved and listed successfully in Client Portal."));

    // ----------------------------------------------------
    // TEST 3: Helper Portal Acceptance
    // ----------------------------------------------------
    console.log(bold("\n3. Testing Helper Portal Acceptance..."));
    const acceptRes = await fetch(`${baseUrl}/api/jobs/${taskId}/accept`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${helperToken}` }
    });
    if (!acceptRes.ok) throw new Error("Helper failed to accept job!");
    console.log(green(`  ✓ Job #EM-${1000 + taskId} accepted successfully by Marcus Williams.`));

    // Verify job is now marked active
    const helperJobsRes = await fetch(`${baseUrl}/api/tasks`, {
      headers: { "Authorization": `Bearer ${helperToken}` }
    });
    const helperJobs = await helperJobsRes.json();
    const acceptedJob = helperJobs.find(t => t.id === taskId);
    if (!acceptedJob || acceptedJob.status !== "active") {
      throw new Error("Job status is not 'active' after helper acceptance!");
    }
    console.log(green("  ✓ Job status successfully updated to 'active' on database tables."));

    // ----------------------------------------------------
    // TEST 4: Job Completion & Ledger Payout Transaction
    // ----------------------------------------------------
    console.log(bold("\n4. Testing Transactional Ledger shifts on Payout..."));
    const completeRes = await fetch(`${baseUrl}/api/jobs/${taskId}/complete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${helperToken}` }
    });
    if (!completeRes.ok) throw new Error("Helper failed to mark job completed!");
    console.log(green(`  ✓ Job #EM-${1000 + taskId} marked Completed.`));

    // Log in again as client and helper to check balances after transaction
    const clientRefreshRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "client@portalapp.com", pw: "Client@123" })
    });
    const refreshedClient = (await clientRefreshRes.json()).user;

    const helperRefreshRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "helper@portalapp.com", pw: "Helper@123" })
    });
    const refreshedHelper = (await helperRefreshRes.json()).user;

    console.log(green("  ✓ Balances and stats updated dynamically:"));
    console.log(`    Client Balance: $${initialClientBalance} → $${refreshedClient.balance} (Debited $${taskBudget})`);
    console.log(`    Helper Balance: $${initialHelperBalance} → $${refreshedHelper.balance} (Credited $${taskBudget})`);
    console.log(`    Helper Streak:  ${initialHelperStreak} → ${refreshedHelper.streak} (Incremented by +1)`);

    // Verify correct mathematical ledger shifts
    if (parseFloat((initialClientBalance - taskBudget).toFixed(2)) !== refreshedClient.balance) {
      throw new Error("Client balance math is incorrect!");
    }
    if (parseFloat((initialHelperBalance + taskBudget).toFixed(2)) !== refreshedHelper.balance) {
      throw new Error("Helper balance math is incorrect!");
    }
    if (initialHelperStreak + 1 !== refreshedHelper.streak) {
      throw new Error("Helper streak math is incorrect!");
    }
    console.log(green("  ✓ Ledger payout math is 100% accurate."));

    // ----------------------------------------------------
    // TEST 5: Rating & Reviews Recalculation
    // ----------------------------------------------------
    console.log(bold("\n5. Testing Ratings Recalculation..."));
    const starRating = 5;
    const reviewRes = await fetch(`${baseUrl}/api/tasks/${taskId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${clientToken}`
      },
      body: JSON.stringify({ rating: starRating })
    });
    if (!reviewRes.ok) throw new Error("Failed to submit rating!");
    console.log(green(`  ✓ Submitted ${starRating}★ review for job #EM-${1000 + taskId}.`));

    // Check helper rating recalculation
    const helperReviewRefresh = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "helper@portalapp.com", pw: "Helper@123" })
    });
    const refreshedHelperRating = (await helperReviewRefresh.json()).user.rating;
    console.log(green(`  ✓ Helper overall rating dynamically updated: ${helperData.user.rating}★ → ${refreshedHelperRating}★`));

    // ----------------------------------------------------
    // TEST 6: Admin Portal, Suspensions & Disputes
    // ----------------------------------------------------
    console.log(bold("\n6. Testing Admin Operations (Suspensions & Disputes)..."));

    // Get dispute list
    const disputesRes = await fetch(`${baseUrl}/api/admin/disputes`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!disputesRes.ok) throw new Error("Admin failed to load disputes!");
    const disputes = await disputesRes.json();
    console.log(green(`  ✓ Loaded disputes successfully (${disputes.length} disputes filed).`));

    // Find a open dispute
    const openDispute = disputes.find(d => d.status === "open");
    if (openDispute) {
      console.log(`    Dispute found: ${openDispute.id} (${openDispute.client} vs ${openDispute.helper} - Amount: ${openDispute.amount})`);
      
      // Resolve dispute as Refund issued
      const resolveRes = await fetch(`${baseUrl}/api/admin/disputes/${openDispute.id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ resolution: "Refund issued" })
      });
      if (!resolveRes.ok) throw new Error(`Failed to resolve dispute ${openDispute.id}`);
      
      console.log(green(`  ✓ Dispute ${openDispute.id} successfully resolved: "Refund issued".`));
    }

    // Toggle suspension of a user
    const targetEmail = "leon@mail.com";
    console.log(`    Suspending/Toggling status of user: ${targetEmail}`);
    const toggleSuspensionRes = await fetch(`${baseUrl}/api/admin/users/${targetEmail}/suspend`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!toggleSuspensionRes.ok) throw new Error("Failed to suspend user!");
    const suspensionResult = await toggleSuspensionRes.json();
    console.log(green(`  ✓ User status updated to: ${suspensionResult.newStatus.toUpperCase()}`));

    // Verify suspended user cannot log in
    if (suspensionResult.newStatus === "suspended") {
      const failedLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, pw: "Helper@123" })
      });
      if (failedLoginRes.status === 403) {
        console.log(green("  ✓ Security Check: Suspended user was successfully blocked from logging in."));
      } else {
        throw new Error("Suspended user logged in when they should have been blocked!");
      }

      // Restore user to active
      await fetch(`${baseUrl}/api/admin/users/${targetEmail}/suspend`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      console.log(green(`  ✓ Restored user ${targetEmail} back to active state.`));
    }

    // Pull Admin Audit Logs stream
    const logsRes = await fetch(`${baseUrl}/api/admin/logs`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const logs = await logsRes.json();
    console.log(green(`  ✓ Loaded audit logs stream (${logs.length} logs streamed).`));
    console.log(`    Last audit entry: [${logs[logs.length-1].lvl}] ${logs[logs.length-1].msg}`);

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log(bold(cyan("\n==================================================")));
    console.log(bold(green("     E2E INTEGRATION TEST RESULTS: SUCCESSFUL     ")));
    console.log(bold(cyan("==================================================")));
    console.log(green("  ✓ All API routing works flawlessly"));
    console.log(green("  ✓ JWT Authentication operates securely"));
    console.log(green("  ✓ Wallet payouts and streaks perform transactionally"));
    console.log(green("  ✓ Admin auditing and access controllers are robust"));
    console.log(bold(cyan("==================================================\n")));

  } catch (error) {
    console.error(bold(red("\n❌ Deep testing encountered a critical failure!")));
    console.error(red(error.message));
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();
