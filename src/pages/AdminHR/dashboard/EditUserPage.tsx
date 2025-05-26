import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Award,
  ChevronLeft,
  ChevronDown,
  DollarSign,
  Phone,
  Building,
  MapPin,
  CreditCard,
} from "lucide-react";
import { UserData } from "../../../types/user";
import { getCurrentUser } from "../../../services/authService";
import Loading from "../../../components/Loading";
import { getUserById, updateUser } from "../../../services/userService";

const EditUserPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    position: "",
    baseSalary: 0,
    phone: "",
    address: "",
    accountNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const dataLoaded = useRef(false);
  const userInfo = getCurrentUser();
  const { name, email, password, role, department, position, baseSalary, phone, address, accountNumber } =
    formData;

  useEffect(() => {
    const fetchUser = async () => {
      if (dataLoaded.current) return;

      try {
        const data = await getUserById(id, userInfo.token);
        setOriginalUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          role: data.role || "employee",
          department: data.department || "",
          position: data.position || "",
          baseSalary: data.baseSalary || 0,
          phone: data.phone || "",
          address: data.address || "",
          accountNumber: data.accountNumber || "",
        });
        dataLoaded.current = true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setFetchLoading(false);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, userInfo.token]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: Partial<UserData> = {};

      if (name !== originalUser?.name) updateData.name = name;
      if (email !== originalUser?.email) updateData.email = email;
      if (password) updateData.password = password;
      if (role !== originalUser?.role) updateData.role = role;
      if (department !== originalUser?.department)
        updateData.department = department;
      if (position !== originalUser?.position) updateData.position = position;
      if (originalUser?.baseSalary !== formData.baseSalary)
        updateData.baseSalary = formData.baseSalary;
      if (phone !== originalUser?.phone) updateData.phone = phone;
      if (address !== originalUser?.address) updateData.address = address;
      if (accountNumber !== originalUser?.accountNumber)
        updateData.accountNumber = accountNumber;

      await updateUser(id, updateData, userInfo.token);
      navigate("/admin/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Loading fullscreen={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:shadow-3xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-wide flex items-center">
              <User className="mr-3 w-7 h-7" /> Edit User Account
            </h3>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <User className="mr-2 w-5 h-5 text-indigo-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter full name"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Mail className="mr-2 w-5 h-5 text-indigo-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter email address"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Lock className="mr-2 w-5 h-5 text-indigo-600" />
                    Password
                    <span className="ml-2 text-sm text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Award className="mr-2 w-5 h-5 text-indigo-600" />
                    User Role
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      id="role"
                      name="role"
                      value={role}
                      onChange={onChange}
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="department"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Building className="mr-2 w-5 h-5 text-indigo-600" />
                    Department
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="department"
                    name="department"
                    value={department}
                    onChange={onChange}
                    placeholder="Enter department"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.department}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Briefcase className="mr-2 w-5 h-5 text-indigo-600" />
                    Position
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="position"
                    name="position"
                    value={position}
                    onChange={onChange}
                    placeholder="Enter position"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.position}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <Phone className="mr-2 w-5 h-5 text-indigo-600" />
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    placeholder="Enter phone number"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="baseSalary"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <DollarSign className="mr-2 w-5 h-5 text-indigo-600" />
                    Base Salary
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="baseSalary"
                    name="baseSalary"
                    value={baseSalary}
                    onChange={onChange}
                    placeholder="Enter base salary"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.baseSalary}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="address"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <MapPin className="mr-2 w-5 h-5 text-indigo-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="address"
                    name="address"
                    value={address}
                    onChange={onChange}
                    placeholder="Enter address"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="text-gray-700 font-semibold mb-2 flex items-center"
                  >
                    <CreditCard className="mr-2 w-5 h-5 text-indigo-600" />
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    id="accountNumber"
                    name="accountNumber"
                    value={accountNumber}
                    onChange={onChange}
                    placeholder="Enter account mumber"
                  />
                  {originalUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {originalUser.accountNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update User Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
