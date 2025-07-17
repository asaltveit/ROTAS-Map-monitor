// Based on https://blog.stackademic.com/create-a-login-form-with-react-hook-form-package-ab1634a206c9
'use client'

import { login } from '@/app/login/actions';
import Form from './ui/admin/Form';

const LoginForm = () => {
    /*
        - didn't put in test account
        isCapitalLetter: (value) =>
            /[A-Z]/.test(value) ||
            "Password should have at least one capital letter",

        Needs:
        - Styling - replace TailwindCSS
        - More validation?
        - Check for active sessions?
    */

    return (
        <div>
            <Form action={login} submitText="Sign in" includeEmail includePassword />
        </div>
    );
};

export default LoginForm;