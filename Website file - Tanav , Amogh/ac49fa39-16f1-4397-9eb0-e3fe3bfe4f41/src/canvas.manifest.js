export const manifest = {
  screens: {
    scr_ldnfsl: { name: "Sign in", route: "/signin", position: { "x": 160, "y": 220 } },
    scr_lr0g01: { name: "Create account", route: "/signup", position: { "x": 1560, "y": 220 } },
    scr_7aq4qc: { name: "Verify email", route: "/verify", state: { "sessionRole": "pending" }, position: { "x": 2960, "y": 220 } },
    scr_lukrqz: { name: "Employee · Dashboard", route: "/", state: { "sessionRole": "employee" }, position: { "x": 160, "y": 2200 } },
    scr_7zrqwv: { name: "Employee · My attendance", route: "/attendance", state: { "sessionRole": "employee" }, position: { "x": 1560, "y": 2200 } },
    scr_q0pu59: { name: "Employee · Leave", route: "/leave", state: { "sessionRole": "employee" }, position: { "x": 2960, "y": 2200 } },
    scr_oeb6bk: { name: "Employee · Payslips", route: "/payslips", state: { "sessionRole": "employee" }, position: { "x": 4360, "y": 2200 } },
    scr_524wcs: { name: "Employee · Profile", route: "/profile", state: { "sessionRole": "employee" }, position: { "x": 5760, "y": 2200 } },
    scr_ruw36o: { name: "Admin · Dashboard queue", route: "/", state: { "sessionRole": "admin" }, position: { "x": 194.9, "y": 4133.47 } },
    scr_oqu6ud: { name: "Admin · Employees", route: "/admin/employees", state: { "sessionRole": "admin" }, position: { "x": 160, "y": 6160 } },
    scr_lpj9bu: { name: "Admin · Employee record", route: "/admin/employees/EMP-1044", state: { "sessionRole": "admin", "employeeTab": "profile" }, position: { "x": 1560, "y": 6160 } },
    scr_vc2ogu: { name: "Admin · Employee salary", route: "/admin/employees/EMP-1044", state: { "sessionRole": "admin", "employeeTab": "payroll" }, position: { "x": 2960, "y": 6160 } },
    scr_r8645b: { name: "Admin · Attendance", route: "/admin/attendance", state: { "sessionRole": "admin" }, position: { "x": 160, "y": 8140 } },
    scr_or4eiz: { name: "Admin · Leave approvals", route: "/admin/leave", state: { "sessionRole": "admin" }, position: { "x": 1560, "y": 8140 } },
    scr_zm89k3: { name: "Admin · Payroll", route: "/admin/payroll", state: { "sessionRole": "admin" }, position: { "x": 2960, "y": 8140 } },
    scr_bxzl3h: { name: "Admin · Reports", route: "/admin/reports", state: { "sessionRole": "admin" }, position: { "x": 4360, "y": 8140 } }
  },
  sections: {
    sec_3thjzc: { name: "Authentication & Onboarding", x: 0, y: 0, width: 4320, height: 1180 },
    sec_bz5ww3: { name: "Employee Portal", x: 0, y: 1980, width: 7120, height: 1180 },
    sec_oc097w: { name: "Admin Dashboard", x: 0, y: 3960, width: 1520, height: 1180 },
    sec_6n40pt: { name: "Admin Employees", x: 0, y: 5940, width: 4320, height: 1180 },
    sec_md7b0f: { name: "Admin Operations", x: 0, y: 7920, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_3thjzc", children: [
    { kind: "screen", id: "scr_ldnfsl" },
    { kind: "screen", id: "scr_lr0g01" },
    { kind: "screen", id: "scr_7aq4qc" }]
  },
  { kind: "section", id: "sec_bz5ww3", children: [
    { kind: "screen", id: "scr_lukrqz" },
    { kind: "screen", id: "scr_7zrqwv" },
    { kind: "screen", id: "scr_q0pu59" },
    { kind: "screen", id: "scr_oeb6bk" },
    { kind: "screen", id: "scr_524wcs" }]
  },
  { kind: "section", id: "sec_oc097w", children: [
    { kind: "screen", id: "scr_ruw36o" }]
  },
  { kind: "section", id: "sec_6n40pt", children: [
    { kind: "screen", id: "scr_oqu6ud" },
    { kind: "screen", id: "scr_lpj9bu" },
    { kind: "screen", id: "scr_vc2ogu" }]
  },
  { kind: "section", id: "sec_md7b0f", children: [
    { kind: "screen", id: "scr_r8645b" },
    { kind: "screen", id: "scr_or4eiz" },
    { kind: "screen", id: "scr_zm89k3" },
    { kind: "screen", id: "scr_bxzl3h" }]
  }]

};