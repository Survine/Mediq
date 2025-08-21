import Customers from "./components/Customers"
import Login from "./components/Login"
import Medicines from "./components/Medicines"
import Users from "./components/Users"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const App = () => {
  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {/* <Login />
      <Users />
      <Customers />
      <Medicines /> */}
    </div>
  )
}
export default App



