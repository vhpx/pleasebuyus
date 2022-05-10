import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency-format';
import AddToCartButton from '../buttons/AddToCartButton';
import AmountAdjuster from '../buttons/AmountAdjuster';
import Card from '../common/Card';
import BetterLink from '../link/BetterLink';

export default function ProductCard({ product }) {
    const { items: products, addItem, removeItem } = useCart();

    return (
        <Card className="flex flex-col justify-between">
            <BetterLink
                href={`/outlets/${product.outlet_id}/products/${product.id}`}
            >
                {product?.avatar_url && (
                    <div className="aspect-square rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="aspect-square rounded-lg mb-2"
                            src={product.avatar_url}
                            alt={product.name}
                            height={400}
                            width={400}
                        />
                    </div>
                )}

                <div className="mb-2">
                    <div className="font-semibold">{product.name}</div>
                    <div>{product.description}</div>
                </div>
            </BetterLink>

            <div className="flex w-full items-start justify-between">
                <div className="font-semibold text-blue-600 dark:text-blue-300">
                    {formatCurrency(product.price)}
                </div>

                {products.findIndex((i) => i.id === product.id) === -1 ? (
                    <AddToCartButton onClick={() => addItem(product)} />
                ) : (
                    <AmountAdjuster
                        amount={
                            products.find((i) => i.id === product.id)?.quantity
                        }
                        onDecrement={() => removeItem(product.id)}
                        onIncrement={() => addItem(product)}
                    />
                )}
            </div>
        </Card>
    );
}
