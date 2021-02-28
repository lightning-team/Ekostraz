import { EkoRoutePaths } from '@app/eko-route-paths';
import { InterventionsRoutePaths } from '@app/modules/interventions/route-paths';

interface MenuItem {
  text: string;
  icon: string;
  showWhenAuthenticated: boolean;
}

interface RoutedMenuItem extends MenuItem {
  routeLink: string | string[];
  routeExact?: boolean;
}

export type MenuItems = RoutedMenuItem[];

export const menuItems: MenuItems = [
  {
    text: 'Zgłoś interwencję',
    icon: 'notifications_active',
    routeLink: EkoRoutePaths.PublicForm,
    showWhenAuthenticated: false,
  },
  {
    text: 'Interwencje',
    icon: 'list',
    routeLink: EkoRoutePaths.Interventions,
    showWhenAuthenticated: true,
    routeExact: true,
  },
  {
    text: 'Mapa',
    icon: 'map',
    routeLink: [EkoRoutePaths.Interventions, InterventionsRoutePaths.Map],
    showWhenAuthenticated: true,
  },
  {
    text: 'Zgłoś',
    icon: 'notifications_active',
    routeLink: [EkoRoutePaths.Interventions, InterventionsRoutePaths.Report],
    showWhenAuthenticated: true,
  },
];
