import Image from "next/image";
import logo from "@/public/assets/logo-white.png";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";

const Header2 = ({ data, category, season, coupons, country }) => {
  const [searchQuery, setSearchQuery] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    setQuery(e);

    if (query.length >= 1) {
      setIsActive(true);
      setIsLoading(true);
      fetch(`${APP_URL}api/store?key=${APP_KEY}&search=${e}`)
        .then((res) => res.json())
        .then((results) => {
          let query = [];
          results?.data?.map((item) =>
            query.push({ name: item.name, slug: item.slug })
          );

          setIsLoading(false);
          setSearchQuery(query);
        });
    } else {
      setIsLoading(false);
      setIsActive(false);
      setSearchQuery([]);
    }
  };

  return (
    <>
      {/* ROW 1 — LOGO */}
      <nav className="navbar bg-header py-2">
        <div className="container">
          <div className="row w-100">
            <div className="col-12 d-flex justify-content-center">
              <Link href="/" className="navbar-brand">
                <Image
                  src={data?.url + "/" + data?.logo?.header || logo}
                  alt="Logo"
                  className="header-logo"
                  width={180}
                  height={60}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ROW 2 — SEARCH BAR */}
      <nav className="navbar bg-header py-0">
        <div className="container-fluid">
          <div className="row w-100 justify-content-end position-relative">
            <div className="col-md-4 col-12 position-relative">
              <div className="input-group input-group-sm">
                <input
                  className="form-control rounded-0 header-search-input"
                  type="search"
                  placeholder="Search brands & coupons"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={query}
                />

                <button
                  className="btn btn-dark header-search-btn"
                  type="button"
                >
                  Search
                </button>
              </div>

              <div className="position-absolute w-100 top-100 header-search z-2">
                {isActive &&
                  (isLoading ? (
                    <div className="list-group">
                      <div className="list-group-item">Loading...</div>
                    </div>
                  ) : searchQuery.length ? (
                    searchQuery.map((item) => (
                      <div className="list-group" key={item.slug}>
                        <Link
                          href={`/store/${item.slug}`}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            setQuery("");
                            setIsActive(false);
                            setSearchQuery([]);
                          }}
                        >
                          {item.name}
                        </Link>
                      </div>
                    ))
                  ) : query.length ? (
                    <div className="list-group">
                      <div className="list-group-item">No Result Found</div>
                    </div>
                  ) : null)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ROW 3 — MENU */}
      <nav className="navbar navbar-expand-lg bg-white py-0 bordertop">
        <div className="container">
          <button
            className="navbar-toggler shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="mainMenu"
          >
            <ul className="navbar-nav nav-css">
              <li className="nav-item px-3">
                <Link className="nav-link" href="/all-stores">
                  Life Style
                </Link>
              </li>
              <li className="nav-item px-3">
                <Link className="nav-link" href="/all-stores">
                  Clothing
                </Link>
              </li>
              <li className="nav-item px-3">
                <Link className="nav-link" href="/all-stores">
                  Travel
                </Link>
              </li>
              <li className="nav-item px-3">
                <Link className="nav-link" href="/all-stores">
                  Shoes
                </Link>
              </li>
              <li className="nav-item px-3  ">
                <Link className="nav-link" href="/all-stores">
                  Occasions
                </Link>
              </li>
              <li className="nav-item dropdown px-3">
                <Link className="nav-link dropdown-toggle" href="/all-stores">
                  Coupons
                </Link>
                <ul className="dropdown-menu rounded-0">
                  <li>
                    <Link className="nav-link nav-item " href="/all-stores">
                      All Stores
                    </Link>
                  </li>
                  <li className="dropdown">
                    <Link
                      className="nav-link nav-item dropdown-toggle"
                      href="/all-stores"
                    >
                      Categories
                    </Link>
                    <ul className="dropdown-menu rounded-0">
                      {category?.slice(0, 10).map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            className="dropdown-item"
                            href={`/category/${cat.slug}`}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul> 
                  </li>
                </ul>
              </li>
             
           
              {/* <li className="nav-item">
                <Link className="nav-link" href="/blogs">
                  Blogs
                </Link>
              </li> */}
              {/* <li className="nav-item memorial-btn">
                <Link
                  href={data?.header?.button_url}
                  className="button header-btn-bg header-btn-text"
                >
                  {data?.header?.button_text}
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header2;
