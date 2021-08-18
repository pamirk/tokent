import Login from "components/auth/Login"
import Account from "components/account/Account"
import Settings from "components/account/Settings"
import Home from "components/home/Home"
import Markets from "components/terminal/markets/Markets"
import ProtocolRevenue from "components/terminal/metrics/protocolRevenue/ProtocolRevenue"
import Revenue from "components/terminal/metrics/revenue/Revenue"
import Projects from "components/terminal/project/Projects"
import Signup from "components/auth/Signup"
import PS from "components/terminal/metrics/ps/PS"
import ResetPassword from "components/auth/ResetPassword"
import TVL from "components/terminal/metrics/tvl/TVL"
import PE from "components/terminal/metrics/pe/PE"
import EmbedProjects from "components/terminal/embed/EmbedProjects"
import EmbedMarkets from "components/terminal/embed/EmbedMarkets"
import EmbedPS from "components/terminal/embed/EmbedPS"
import EmbedPE from "components/terminal/embed/EmbedPE"
import EmbedTVL from "components/terminal/embed/EmbedTVL"
import EmbedRevenue from "components/terminal/embed/EmbedRevenue"
import EmbedProtocolRevenue from "components/terminal/embed/EmbedProtocolRevenue"
import CustomTable from "components/terminal/tables/CustomTable"
import Feed from "components/feed/Feed"
import Custom from "components/terminal/project/Custom"

export const Routes = [
  { path: "/home", component: Home },
  { path: "/account", component: Account },
  { path: "/settings", component: Settings },
  { path: "/reset_password/:token", component: ResetPassword },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },

  { path: "/markets-feed", component: Feed },

  {
    path: "/terminal/markets/:marketId/embed/:chartId",
    component: EmbedMarkets,
  },
  { path: "/terminal/markets/:marketId/:section", component: Markets },
  { path: "/terminal/markets/:marketId", component: Markets },

  { path: "/terminal/metrics/ps/embed/:chartId", component: EmbedPS },
  { path: "/terminal/metrics/ps/:section", component: PS },
  { path: "/terminal/metrics/ps", component: PS },

  { path: "/terminal/metrics/pe/embed/:chartId", component: EmbedPE },
  { path: "/terminal/metrics/pe/:section", component: PE },
  { path: "/terminal/metrics/pe", component: PE },

  { path: "/terminal/metrics/tvl/embed/:chartId", component: EmbedTVL },
  { path: "/terminal/metrics/tvl/:section", component: TVL },
  { path: "/terminal/metrics/tvl", component: TVL },

  { path: "/terminal/metrics/revenue/embed/:chartId", component: EmbedRevenue },
  { path: "/terminal/metrics/revenue/:section", component: Revenue },
  { path: "/terminal/metrics/revenue", component: Revenue },

  {
    path: "/terminal/metrics/protocol_revenue/embed/:chartId",
    component: EmbedProtocolRevenue,
  },
  {
    path: "/terminal/metrics/protocol_revenue/:section",
    component: ProtocolRevenue,
  },
  { path: "/terminal/metrics/protocol_revenue", component: ProtocolRevenue },

  {
    path: "/terminal/projects/:projectId/embed/:chartId",
    component: EmbedProjects,
  },
  { path: "/terminal/projects/:projectId/:section", component: Projects },
  { path: "/terminal/projects/:projectId", component: Projects },

  { path: "/terminal/tables/:tableId", component: CustomTable },

  { path: "/terminal/pro/custom", component: Custom },

  { path: "/", component: Home },
]
