import { GigsParams, createGigsEndpoint, endpoints } from "@/constants/endpoints";
import { PaymentStatus } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";

describe("createGigsEndpoint", () => {
  it("should return the base gigs path, if params is an empty object.", () => {
    const basePath = "/api/gigs";
    const params = {};
    const result = createGigsEndpoint(basePath, params);
    expect(result).toBe(basePath);
  });
  it("should return the gigs path with query strings, if params is not an empty object.", () => {
    const basePath = "/api/gigs";
    const params: GigsParams = {
      title: "testtt",
      freelancerType: "DESIGNERS",
      skills: ["ILLUSTRATOR", "FIGMA"],
      gigType: "INDIVIDUAL",
      price: "99.99",
      freelancerProfileId: "001",
    };
    const result = createGigsEndpoint(basePath, params);
    expect(result).toBe("/api/gigs?page=0&title=testtt&limit=6&freelancerType=DESIGNERS&skills=ILLUSTRATOR&skills=FIGMA&gigType=INDIVIDUAL&price=99.99&freelancerProfileId=001");
  });
});

describe('endpoints', () => {
  describe('API', () => {
    it('should return the proper userById endpoint', () => {
      const id = '001';
      expect(endpoints.API.userById(id)).toBe(`/api/users/${id}`);
    });

    it('should return the proper profileByUserId endpoint', () => {
      const userId = '001';
      expect(endpoints.API.profileByUserId(userId)).toBe(`/api/profiles/${userId}`);
    });

    it('should return the proper freelancerProfileByUserId endpoint', () => {
      const userId = '001';
      expect(endpoints.API.freelancerProfileByUserId(userId)).toBe(`/api/freelancer-profiles/${userId}`);
    });

    it('should return the proper gigs endpoint', () => {
      const params: GigsParams = {
        page: 1,
        title: "testtt",
        freelancerType: "DESIGNERS",
        skills: ["ILLUSTRATOR", "FIGMA"],
        gigType: "INDIVIDUAL",
        price: "99.99",
        limit: 10,
        freelancerProfileId: "001",
      };
      expect(endpoints.API.gigs(params)).toBe("/api/gigs?page=1&title=testtt&limit=10&freelancerType=DESIGNERS&skills=ILLUSTRATOR&skills=FIGMA&gigType=INDIVIDUAL&price=99.99&freelancerProfileId=001");
    });

    it('should return the proper gigByGigId endpoint', () => {
      const gigId = '001';
      expect(endpoints.API.gigByGigId(gigId)).toBe(`/api/gigs/${gigId}`);
    })

    it('should return the proper cartByUserId endpoint', () => {
      const userId = '001';
      expect(endpoints.API.cartByUserId(userId)).toBe(`/api/carts/${userId}`);
    })

    it('should return the proper gigsOnCartByGigIdAndUserId endpoint', () => {
      const userId = '001';
      const gigId = '123'
      expect(endpoints.API.gigsOnCartByGigIdAndUserId(gigId, userId)).toBe(`/api/gigs-on-cart/${gigId}/${userId}`);
    })

    it('should return the proper gigsOnCartByGigIdAndUserId endpoint', () => {
      expect(endpoints.API.checkoutSessions()).toBe(`/api/stripe/checkout_sessions`);
    })

    it('should return the proper gigsOnCartByGigIdAndUserId endpoint', () => {
      expect(endpoints.API.checkoutSessions()).toBe(`/api/stripe/checkout_sessions`);
    })

    it('should return the proper orderHistory endpoint', () => {
      const userId = '001'
      const fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] } = {
        pageIndex: 0,
        pageSize: 10,
        paymentStatus: ["PAID", "REFUNDED"]
      }
      expect(endpoints.API.orderHistory(userId, fetchDataOptions)).toBe("/api/order/history/001?page=0&limit=10&paymentStatus=PAID&paymentStatus=REFUNDED");
    })

    it('should return the proper customerOrder endpoint', () => {
      const userId = '001'
      const fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] } = {
        pageIndex: 0,
        pageSize: 10,
        paymentStatus: ["PAID", "REFUNDED"]
      }
      expect(endpoints.API.customerOrder(userId, fetchDataOptions)).toBe("/api/customer-order/001?page=0&limit=10&paymentStatus=PAID&paymentStatus=REFUNDED");
    })

    it('should return the proper createConnectedAccount endpoint', () => {
      expect(endpoints.API.createConnectedAccount()).toBe(`/api/stripe/create_connected_account`);
    })

    it('should return the proper createLoginLink endpoint', () => {
      expect(endpoints.API.createLoginLink()).toBe(`/api/stripe/create_login_link`);
    })

    it('should return the proper withdraw endpoint', () => {
      expect(endpoints.API.withdraw()).toBe(`/api/stripe/withdraw`);
    })

    it('should return the proper users endpoint', () => {
      expect(endpoints.API.users()).toBe(`/api/users`);
    })

    it('should return the proper freelancerProfiles endpoint', () => {
      const fetchDataOptions: PaginationState & { verifiedArray?: boolean[] } = {
        pageIndex: 0,
        pageSize: 10,
        verifiedArray: [true, false]
      }
      expect(endpoints.API.freelancerProfiles(fetchDataOptions)).toBe("/api/freelancer-profiles?page=0&limit=10&verified=true&verified=false");
    })
  });

  describe('PAGE', () => {
    it('should return the proper gigs endpoint', () => {
      const params: GigsParams = {
        page: 1,
        title: "testtt",
        freelancerType: "DESIGNERS",
        skills: ["ILLUSTRATOR", "FIGMA"],
        gigType: "INDIVIDUAL",
        price: "99.99",
        limit: 10,
        freelancerProfileId: "001",
      };
      expect(endpoints.PAGE.gigs(params)).toBe("gigs?page=1&title=testtt&limit=10&freelancerType=DESIGNERS&skills=ILLUSTRATOR&skills=FIGMA&gigType=INDIVIDUAL&price=99.99&freelancerProfileId=001");
    });

    it('should return the proper home endpoint', () => {
      expect(endpoints.PAGE.home()).toBe('/');
    });

    it('should return the proper browseGigs endpoint with query strings', () => {
      const pageNumber = 0
      const freelancerType: FreelancerType = 'DESIGNERS'
      expect(endpoints.PAGE.browseGigs(pageNumber, freelancerType)).toBe('/browse/gigs?page=0&freelancerType=DESIGNERS');
    });

    it("should return the proper browseGigs endpoint with no query string", () => {
      const pageNumber = 0
      const basePath = `/browse/gigs?page=${pageNumber}`
      expect(endpoints.PAGE.browseGigs(pageNumber)).toBe(basePath);
    });

    it('should return the proper registerFreelancer endpoint', () => {
      expect(endpoints.PAGE.registerFreelancer()).toBe('/register/freelancer');
    });

    it('should return the proper gigDetails endpoint', () => {
      const freelancerId = '001'
      const gigId = '123'
      expect(endpoints.PAGE.gigDetails(freelancerId, gigId)).toBe('/gig/001/123');
    });

    it('should return the proper publicUserProfile endpoint', () => {
      const userId = '001';
      expect(endpoints.PAGE.publicUserProfile(userId)).toBe(`/user/public/${userId}`);
    })

    it('should return the proper gigCart endpoint', () => {
      const userId = '001';
      expect(endpoints.PAGE.gigCart(userId)).toBe(`/cart/gigs/${userId}`);
    })

    it('should return the proper orderHistory endpoint', () => {
      const userId = '001';
      expect(endpoints.PAGE.orderHistory(userId)).toBe(`/order/history/${userId}`);
    })

    it('should return the proper customerOrder endpoint', () => {
      const freelancerId = '001';
      expect(endpoints.PAGE.customerOrder(freelancerId)).toBe(`/customer-order/${freelancerId}`);
    })

    it('should return the proper mangeGigs endpoint', () => {
      const freelancerId = '001';
      expect(endpoints.PAGE.mangeGigs(freelancerId)).toBe(`/manage-gigs/${freelancerId}`);
    })

    it('should return the proper freelancerProfilePage endpoint', () => {
      const freelancerId = '001';
      expect(endpoints.PAGE.freelancerProfilePage(freelancerId)).toBe(`/freelancer-profile/${freelancerId}`);
    })

    it('should return the proper adminDashboard endpoint', () => {
      expect(endpoints.PAGE.adminDashboard()).toBe('/admin/dashboard');
    })

    it('should return the proper adminFreelancers endpoint', () => {
      expect(endpoints.PAGE.adminFreelancers()).toBe(`/admin/freelancers`);
    })

    it('should return the proper adminFreelancers endpoint', () => {
      expect(endpoints.PAGE.createGig()).toBe(`/create-gig`);
    })

    it('should return the proper adminFreelancers endpoint', () => {
      const userId = '001'
      expect(endpoints.PAGE.profile(userId)).toBe(`/profile/001`);
    })
  });
});

