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

export const expertProtectedRoutes : RouteConfig = {
    pattern: [/^\/expert\/dashboard/ ], // Matches any path that starts with /expert/dashboard
    exact : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /admin/dashboard
    exact : []
}



export const clientProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
    exact : [ "/payment/success"]
};

// Nexora marketplace — seller workspace.
export const sellerProtectedRoutes: RouteConfig = {
    pattern: [/^\/seller(\/|$)/],
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

export const getRouteOwner = (pathname : string) :  "ADMIN" | "EXPERT" | "CLIENT" | "SELLER" | "CUSTOMER" | "COMMON" | null => {
    if(isRouteMatches(pathname, expertProtectedRoutes)) {
        return "EXPERT";
    }

    if(isRouteMatches(pathname, sellerProtectedRoutes)) {
        return "SELLER";
    }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, clientProtectedRoutes)) {
        return "CLIENT";
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
    if(role === "EXPERT") {
        return "/expert/dashboard";
    }
    if(role === "CLIENT") {
        return "/dashboard";
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