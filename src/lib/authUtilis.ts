export type UserRole = "ADMIN" | "CLIENT" | "EXPERT" | "CUSTOMER" | "SELLER";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : [
        "/my-profile",
        "/change-password",
        "/apply-expert",
        "/experts/apply-expert",
    ],
    pattern : []
}






// Nexora marketplace — seller workspace.
export const sellerProtectedRoutes: RouteConfig = {
    pattern: [/^\/seller(\/|$)/],
    exact: [],
};
export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin(\/|$)/],
    exact: [],
};

// Nexora marketplace — customer area (account + checkout).
export const customerProtectedRoutes: RouteConfig = {
    pattern: [/^\/account(\/|$)/, /^\/checkout(\/|$)/],
    exact: [],
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) :  "ADMIN" | "SELLER" | "CUSTOMER" | "COMMON" | null => {
   

    if(isRouteMatches(pathname, sellerProtectedRoutes)) {
        return "SELLER";
    }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    

    if(isRouteMatches(pathname, customerProtectedRoutes)) {
        return "CUSTOMER";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN" ) {
        return "/admin/marketplace";
    }
    if(role === "SELLER") {
        return "/seller";
    }
  
    if(role === "CUSTOMER") {
        return "/";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
   const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}