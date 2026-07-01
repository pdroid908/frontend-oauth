export default function DashboardPage() {
  const stats = [
    {
      title: "Revenue",
      value: "$1,248,300",
      growth: "+18.4%",
    },
    {
      title: "Customers",
      value: "12,482",
      growth: "+7.8%",
    },
    {
      title: "Orders",
      value: "4,281",
      growth: "+12.1%",
    },
    {
      title: "System Health",
      value: "99.98%",
      growth: "Stable",
    },
  ];

  const employees = [
    {
      name: "John Anderson",
      department: "Engineering",
      status: "Online",
    },
    {
      name: "Sarah Williams",
      department: "Finance",
      status: "Meeting",
    },
    {
      name: "Michael Brown",
      department: "Marketing",
      status: "Offline",
    },
    {
      name: "Emma Wilson",
      department: "HR",
      status: "Online",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
          <h1 className="text-xl font-bold">
            Enterprise Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <button className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700">
              Notifications
            </button>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-500" />
              <div>
                <p className="font-semibold">
                  Administrator
                </p>
                <p className="text-xs text-slate-400">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 lg:block">

          <nav className="space-y-2 p-6">

            {[
              "Dashboard",
              "Analytics",
              "Employees",
              "Projects",
              "Finance",
              "Reports",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-cyan-500 hover:text-black"
              >
                {item}
              </button>
            ))}

          </nav>

        </aside>

        {/* Content */}
        <section className="flex-1 p-8">

          <h2 className="mb-8 text-3xl font-bold">
            Company Overview
          </h2>

          {/* Stats */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold">
                  {item.value}
                </h3>

                <span className="mt-4 inline-block rounded bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
                  {item.growth}
                </span>
              </div>
            ))}

          </div>

          {/* Charts */}

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
              <h3 className="mb-6 text-xl font-semibold">
                Revenue Analytics
              </h3>

              <div className="flex h-72 items-end gap-4">

                {[40,70,60,90,75,110,95,130,105,145].map((h,index)=>(
                  <div
                    key={index}
                    className="flex-1 rounded-t-xl bg-cyan-500"
                    style={{
                      height:`${h}%`
                    }}
                  />
                ))}

              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h3 className="mb-6 text-xl font-semibold">
                System Status
              </h3>

              <div className="space-y-5">

                {[
                  ["API","99%"],
                  ["Database","100%"],
                  ["Server","97%"],
                  ["Storage","82%"],
                ].map(([name,value])=>(
                  <div key={name}>
                    <div className="mb-2 flex justify-between">
                      <span>{name}</span>
                      <span>{value}</span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-800">
                      <div
                        className="h-3 rounded-full bg-cyan-500"
                        style={{
                          width:value
                        }}
                      />
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* Employee Table */}

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Active Employees
              </h3>

              <button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black">
                View All
              </button>
            </div>

            <table className="w-full">

              <thead className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <th className="py-3 text-left">Employee</th>
                  <th className="py-3 text-left">Department</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {employees.map((emp)=>(
                  <tr
                    key={emp.name}
                    className="border-b border-slate-800"
                  >
                    <td className="py-4">
                      {emp.name}
                    </td>

                    <td>
                      {emp.department}
                    </td>

                    <td>
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
                        {emp.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}