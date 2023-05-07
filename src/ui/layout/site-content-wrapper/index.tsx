import { FunctionComponent, ReactNode } from 'react'

const SiteContentWrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col flex-auto p-4 md:p-4 overflow-auto">
            {children}
        </div>
    )
}

export default SiteContentWrapper
