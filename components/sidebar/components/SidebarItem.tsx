import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SubItem {
  icon?: typeof LucideIcon;
  label: string;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

interface SidebarItemProps {
  icon: typeof LucideIcon;
  label: string;
  expanded?: boolean;
  href?: string;
  onClick?: () => void;
  subItems?: SubItem[];
  active?: boolean;
}

export function SidebarItem({ icon: Icon, label, expanded, href, onClick, subItems, active }: SidebarItemProps) {
  const button = (
    <Button
      variant={"ghost"}
      onClick={onClick}
      className={cn(
        'mb-1 w-full justify-between gap-4 bg-transparent hover:bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
        active
          ? 'text-[#FF0000] bg-red-50 dark:bg-red-950/20'
          : 'text-gray-400 hover:text-[#FF0000] hover:bg-red-50/50 dark:hover:bg-red-950/10',
        'py-5 px-4',
        'rounded-lg',
        'shadow-none',
        'transition-all duration-200'
      )}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 md:h-5 md:w-5" />
        <span className="font-medium">{label}</span>
      </div>
    </Button>
  );

  return (
    <div className="md:w-full w-[90%] mx-auto">
      {href ? (
        <a href={href} className="block">
          {button}
        </a>
      ) : button}
      {expanded && subItems && subItems.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 md:ml-8 md:mt-1 md:space-y-1">
          {subItems.map((subItem) => {
            const subButton = (
              <Button
                key={subItem.label}
                variant={"ghost"}
                onClick={subItem.onClick}
                className={cn(
                  'w-full justify-between gap-4 bg-transparent hover:bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  subItem.active
                    ? 'text-[#FF0000] bg-red-50 dark:bg-red-950/20'
                    : 'text-gray-600 hover:text-[#FF0000] hover:bg-red-50/50 dark:hover:bg-red-950/10',
                  'h-12 md:h-8 md:text-sm text-base py-4 md:py-2 rounded-xl md:rounded-none',
                  'transition-all duration-200'
                )}
              >
                <div className="flex items-center gap-4">
                  {subItem.icon && <subItem.icon className="h-5 w-5 md:h-4 md:w-4" />}
                  <span className="font-medium">{subItem.label}</span>
                </div>
              </Button>
            );
            return subItem.href ? (
              <a key={subItem.label} href={subItem.href} className="block">
                {subButton}
              </a>
            ) : subButton;
          })}
        </div>
      )}
    </div>
  );
}