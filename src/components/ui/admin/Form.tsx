// Based on https://blog.stackademic.com/create-a-login-form-with-react-hook-form-package-ab1634a206c9
'use client'

type FormProps = {
    action: (formData: FormData) => void,
    submitText: string,
    includeEmail?: boolean,
    includePassword?: boolean
}

const Form = ({ action, submitText, includeEmail=false, includePassword=false }: FormProps) => {
    /*
        Needs:
        - Styling

        TODO:
        - Check that email exists before checking password? For reset?
        - Remove user as well?
    */
    // will the ifs cause formData issues? mt-10 leading-6
    return (
        <div>
            <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    { includeEmail && 
                        <div className="pt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    className="block w-full ps-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    }
                    { includePassword &&
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-400"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    className="block w-full ps-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    }
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            formAction={action}
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;