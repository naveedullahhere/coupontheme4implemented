import Link from 'next/link'
import React from 'react'

const Pagnation = ({ words }) => {
    return (
        <ul className="custom-pag row p-0 w-100 mx-auto">

            {/* <ul class="pagination border-0 rounded-0 custom-pag"> */}
            {/* <li class="page-item"><a class="page-link" href="#">Previous</a></li> */}
            {words?.map((item) => <li class="page-item"><Link class="page-link" href={`#${item}`}>{item.toUpperCase()}</Link></li>
            )}
            {/* <li class="page-item"><a class="page-link" href="#">Next</a></li> */}
            {/* </ul> */}

        </ul>
    )
}

export default Pagnation