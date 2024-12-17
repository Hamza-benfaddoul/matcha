
interface InfoProps {
    id: string;
    user: any;
}
const Info = ({id, user}: InfoProps) => {
    return (
        <div className="mt-4 info-card p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">First Name</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.firstname}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Last Name</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastname}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gender</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.gender}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sexual Preferences</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.sexual_preferences}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Biography</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.biography}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default Info;