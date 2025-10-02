import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarUsers() {
  return (
    <div className="flex items-center rounded-full p-0.5 gap-1.5 border border-border shadow-sm shadow-black/5">
      <div className="flex -space-x-1">
        <Avatar className="size-7">
          <AvatarImage src="https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="https://images.pexels.com/photos/6156393/pexels-photo-6156393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
      </div>

      <p className="text-xs text-muted-foreground me-1.5">
        Trusted by <span className="font-semibold text-foreground">100K+</span> useers.
      </p>
    </div>
  );
}
