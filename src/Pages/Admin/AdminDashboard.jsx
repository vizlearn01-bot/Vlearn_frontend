import AdminSideNav from '../../Components/Admin/AdminSideNav'

function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSideNav />
      <div>
        <p>This is my admin dashboard </p>
      </div>
    </div>
  )
}

export default AdminDashboard
